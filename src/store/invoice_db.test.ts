import { beforeEach, describe, expect, test } from "bun:test";

import { useInvoiceStore } from "./invoice_db";

const medicine = (over: Partial<MedicineItem> = {}): MedicineItem => ({
  id: "1",
  name: "Paracetamol 500",
  hsn: "3004",
  batch: "B1",
  barcode: "",
  exp_date: "2027-01-01",
  stock: 10,
  store_stock: 10,
  total_units: 100,
  total_store_units: 100,
  mrp: 100,
  unit_mrp: 10,
  packing_size: 10,
  rate: 8,
  gst: 12,
  packing: "10 TAB",
  rack: null,
  stock_id: 1,
  schedule: "",
  is_narcotic: 0,
  ...over,
});

const store = () => useInvoiceStore.getState();

// Mirrors what the sale items table does when a medicine is picked for a row.
const selectMedicine = (index: number, med: MedicineItem) => {
  store().setInvoiceItemsFromMedicineItem(med, store().invoiceItems[index]);
  store().updateInvoiceItemsField(index, "qty", "1");
};

beforeEach(() => {
  useInvoiceStore.setState(useInvoiceStore.getInitialState(), true);
});

describe("invoice store item updates", () => {
  test("selecting a medicine totals the invoice", () => {
    selectMedicine(0, medicine());
    const s = store();
    expect(s.invoiceItems[0].taxableAmount).toBe(10);
    expect(s.totals).toEqual({
      subTotal: 10,
      gstTotal: 1.2,
      netPayable: 11.2,
      roundedNetPayable: 11,
    });
    expect(s.adjustment.roundOff).toBe("-0.20");
    expect(s.gstSlab.get("12")?.amount).toBe(11.2);
  });

  test("selecting a medicine keeps the row in place", () => {
    store().addEmptyInvoiceItem();
    const ids = store().invoiceItems.map((i) => i.id);
    selectMedicine(0, medicine());
    expect(store().invoiceItems.map((i) => i.id)).toEqual(ids);
    expect(store().invoiceItems[0].item).toBe("Paracetamol 500");
    expect(store().invoiceItems[1].item).toBe("");
  });

  test("totals add up across several items", () => {
    selectMedicine(0, medicine());
    store().addEmptyInvoiceItem();
    selectMedicine(1, medicine({ name: "Syrup", unit_mrp: 50, mrp: 500, gst: 5 }));
    store().updateInvoiceItemsField(0, "qty", "2");
    const s = store();
    expect(s.totals).toEqual({
      subTotal: 70,
      gstTotal: 4.9,
      netPayable: 74.9,
      roundedNetPayable: 75,
    });
    expect(s.gstSlab.size).toBe(2);
  });

  test("deleting an item recalculates totals, round off and balance", () => {
    selectMedicine(0, medicine());
    store().addEmptyInvoiceItem();
    selectMedicine(1, medicine({ name: "Syrup", unit_mrp: 50, mrp: 500, gst: 5 }));
    store().updateInvoicePaymentField("cash", "100");
    store().deleteInvoiceItems(store().invoiceItems[1].id);
    const s = store();
    expect(s.totals.netPayable).toBe(11.2);
    expect(s.totals.roundedNetPayable).toBe(11);
    expect(s.adjustment.roundOff).toBe("-0.20");
    expect(s.payment.balance).toBe(89);
    expect([...s.gstSlab.keys()]).toEqual(["12"]);
  });

  test("deleting the last item resets the invoice", () => {
    selectMedicine(0, medicine());
    store().updateInvoiceItemsField(0, "disc", "5");
    store().deleteInvoiceItems(store().invoiceItems[0].id);
    const s = store();
    expect(s.invoiceItems).toHaveLength(1);
    expect(s.invoiceItems[0].item).toBe("");
    expect(s.totals.roundedNetPayable).toBe(0);
    expect(s.gstSlab.size).toBe(0);
    expect(s.adjustment.disableBulkDisc).toBeUndefined();
  });
});

describe("invoice store discounts", () => {
  beforeEach(() => {
    selectMedicine(0, medicine());
    store().updateInvoiceItemsField(0, "qty", "10");
  });

  test("an item discount locks the bulk discount", () => {
    store().updateInvoiceItemsField(0, "disc", "10");
    expect(store().totals.subTotal).toBe(90);
    expect(store().adjustment.disableBulkDisc).toBeDefined();

    store().updateInvoiceAdjustment("disc", "5");
    expect(store().adjustment.disc).toBe("");
    expect(store().totals.subTotal).toBe(90);
  });

  test("removing the item discount unlocks the bulk discount", () => {
    store().updateInvoiceItemsField(0, "disc", "10");
    store().updateInvoiceItemsField(0, "disc", "0");
    expect(store().adjustment.disableBulkDisc).toBeUndefined();
  });

  test("deleting the discounted item unlocks the bulk discount", () => {
    store().addEmptyInvoiceItem();
    selectMedicine(1, medicine({ name: "Syrup" }));
    store().updateInvoiceItemsField(0, "disc", "10");
    store().deleteInvoiceItems(store().invoiceItems[0].id);
    expect(store().adjustment.disableBulkDisc).toBeUndefined();
  });

  test("a bulk discount reduces taxable, gst and net payable", () => {
    store().updateInvoiceAdjustment("disc", "10");
    const s = store();
    expect(s.totals).toEqual({
      subTotal: 90,
      gstTotal: 10.8,
      netPayable: 100.8,
      roundedNetPayable: 101,
    });
    expect(s.gstSlab.get("12")).toEqual({
      gst: 12,
      taxable: 90,
      cgst: 5.4,
      sgst: 5.4,
      amount: 100.8,
    });
    expect(s.adjustment.disableItemsDisc).toBeDefined();
  });

  test("a bulk discount locks item discounts and follows item edits", () => {
    store().updateInvoiceAdjustment("disc", "10");
    store().updateInvoiceItemsField(0, "disc", "5");
    expect(store().invoiceItems[0].disc).toBe("0");

    store().updateInvoiceItemsField(0, "qty", "20");
    expect(store().totals.subTotal).toBe(180);
    expect(store().totals.gstTotal).toBe(21.6);
  });

  test("switching the bulk discount type recalculates", () => {
    store().updateInvoiceAdjustment("disc", "5");
    expect(store().totals.subTotal).toBe(95);
    store().updateInvoiceAdjustment("discType", "₹");
    expect(store().totals.subTotal).toBe(95);
    store().updateInvoiceAdjustment("disc", "2");
    expect(store().totals.subTotal).toBe(98);
  });

  test("clearing the bulk discount restores totals and unlocks items", () => {
    store().updateInvoiceAdjustment("disc", "10");
    store().updateInvoiceAdjustment("disc", "");
    expect(store().totals.subTotal).toBe(100);
    expect(store().adjustment.disableItemsDisc).toBeUndefined();
  });
});

describe("invoice store round off", () => {
  test("a manual round off moves net payable and the balance", () => {
    selectMedicine(0, medicine());
    store().updateInvoicePaymentField("cash", "12");
    store().updateInvoiceAdjustment("roundOff", "0.80");
    const s = store();
    expect(s.adjustment.roundOff).toBe("0.80");
    expect(s.totals.roundedNetPayable).toBe(12);
    expect(s.payment.balance).toBe(0);
  });

  test("a manual round off still works with an item discount", () => {
    selectMedicine(0, medicine());
    store().updateInvoiceItemsField(0, "disc", "10");
    // taxable 9, gst 1.08
    store().updateInvoiceAdjustment("roundOff", "-0.08");
    expect(store().totals.roundedNetPayable).toBe(10);
  });
});
