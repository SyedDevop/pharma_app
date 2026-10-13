import { describe, expect, test } from "bun:test";

import { EMPTY_INVOICE_ADJUSTMENT, EMPTY_INVOICE_PAYMENT, emptyInvoiceItem } from "./const_data";
import {
  calcBulkDiscount,
  mapMedicineItemToInvoiceItem,
  recalcInvoice,
  recalcInvoiceItem,
  updateGstSlab,
  updateInvoiceItem,
  updateInvoiceTotals,
} from "./helper";

const MAX_DISC = 10;

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

// qty x unit_mrp at the given gst, no discount.
const line = (qty: string, med: Partial<MedicineItem> = {}) =>
  mapMedicineItemToInvoiceItem(medicine(med), { ...emptyInvoiceItem(), qty }, MAX_DISC);

const edit = (
  items: InvoiceItemFormData[],
  key: keyof InvoiceItemFormData,
  value: string,
  adjustment = EMPTY_INVOICE_ADJUSTMENT,
) => updateInvoiceItem(items, 0, key, value, MAX_DISC, adjustment);

describe("mapMedicineItemToInvoiceItem", () => {
  test("fills taxable, gst and amount for the row qty", () => {
    const item = line("2");
    expect(item.sellRate).toBe("10");
    expect(item.taxableAmount).toBe(20);
    expect(item.gstAmount).toBe(2.4);
    expect(item.cgst).toBe("1.20");
    expect(item.sgst).toBe("1.20");
    expect(item.amount).toBe("22.40");
  });
});

describe("updateInvoiceItem", () => {
  test("recalculates amounts when qty changes", () => {
    const [item] = edit([line("1")], "qty", "3");
    expect(item.taxableAmount).toBe(30);
    expect(item.gstAmount).toBe(3.6);
    expect(item.amount).toBe("33.60");
  });

  test("returns the same array when nothing changed", () => {
    const items = [line("1")];
    expect(edit(items, "qty", "1")).toBe(items);
  });

  test("clamps qty to store stock and sell rate to mrp", () => {
    expect(edit([line("1")], "qty", "500")[0].qty).toBe("100");
    expect(edit([line("1")], "sellRate", "250")[0].sellRate).toBe("100");
  });

  test("keeps the typed value when it is within limits", () => {
    expect(edit([line("1")], "sellRate", "9.50")[0].sellRate).toBe("9.50");
  });

  test("applies a % discount before gst", () => {
    const [item] = edit([line("2")], "disc", "5");
    expect(item.taxableAmount).toBe(19);
    expect(item.gstAmount).toBe(2.28);
    expect(item.amount).toBe("21.28");
  });

  test("caps a % discount at the max discount", () => {
    const [item] = edit([line("2")], "disc", "25");
    expect(item.disc).toBe("10");
    expect(item.taxableAmount).toBe(18);
  });

  test("caps a ₹ discount against the whole line, not one unit", () => {
    let items = edit([line("10")], "discType", "₹");
    items = edit(items, "disc", "50");
    expect(items[0].disc).toBe("10");
    expect(items[0].taxableAmount).toBe(90);
    expect(items[0].gstAmount).toBe(10.8);
    expect(items[0].amount).toBe("100.80");
  });

  test("allows a ₹ discount below one rupee of headroom", () => {
    let items = edit([line("1", { unit_mrp: 4, mrp: 40 })], "discType", "₹");
    items = edit(items, "disc", "0.4");
    expect(items[0].disc).toBe("0.4");
    expect(items[0].taxableAmount).toBe(3.6);
  });

  test("re-caps a ₹ discount when qty drops", () => {
    let items = edit([line("10")], "discType", "₹");
    items = edit(items, "disc", "10");
    items = edit(items, "qty", "5");
    expect(items[0].disc).toBe("5");
    expect(items[0].taxableAmount).toBe(45);
  });

  test("re-caps the discount when switching from ₹ to %", () => {
    let items = edit([line("100")], "discType", "₹");
    items = edit(items, "disc", "50");
    expect(items[0].disc).toBe("50");
    items = edit(items, "discType", "%");
    expect(items[0].disc).toBe("10");
    expect(items[0].taxableAmount).toBe(900);
  });

  test("rejects negative qty and discount", () => {
    expect(edit([line("1")], "qty", "-3")[0].taxableAmount).toBe(0);
    const [item] = edit([line("1")], "disc", "-5");
    expect(item.disc).toBe("0");
    expect(item.taxableAmount).toBe(10);
  });

  test("ignores item discount edits while a bulk discount is applied", () => {
    const items = [line("1")];
    expect(edit(items, "disc", "5", { ...EMPTY_INVOICE_ADJUSTMENT, disc: "5" })).toBe(items);
  });
});

describe("recalcInvoiceItem", () => {
  test("rounds line amounts to paise", () => {
    const item = recalcInvoiceItem(
      { ...line("3", { unit_mrp: 3.33, gst: 5 }), disc: "7" },
      MAX_DISC,
    );
    // 9.99 - 7% = 9.2907 -> 9.29, gst 0.4645 -> 0.46
    expect(item.taxableAmount).toBe(9.29);
    expect(item.gstAmount).toBe(0.46);
    expect(item.amount).toBe("9.75");
  });
});

describe("updateInvoiceTotals", () => {
  const items = [line("2"), line("1", { unit_mrp: 50, mrp: 500, gst: 5 })];

  test("sums every item once", () => {
    expect(updateInvoiceTotals(items)).toEqual({
      subTotal: 70,
      gstTotal: 4.9,
      netPayable: 74.9,
      roundedNetPayable: 74.9,
    });
  });

  test("takes the bulk discount off the taxable amount and scales gst", () => {
    expect(updateInvoiceTotals(items, 7)).toEqual({
      subTotal: 63,
      gstTotal: 4.41,
      netPayable: 67.41,
      roundedNetPayable: 67.41,
    });
  });

  test("is zero for an empty row", () => {
    expect(updateInvoiceTotals([emptyInvoiceItem()]).netPayable).toBe(0);
  });
});

describe("updateGstSlab", () => {
  test("groups by gst rate and skips empty rows", () => {
    const slab = updateGstSlab([
      line("2"),
      line("1"),
      line("1", { unit_mrp: 50, mrp: 500, gst: 5 }),
      emptyInvoiceItem(),
    ]);
    expect([...slab.keys()]).toEqual(["12", "5"]);
    expect(slab.get("12")).toEqual({ gst: 12, taxable: 30, cgst: 1.8, sgst: 1.8, amount: 33.6 });
    expect(slab.get("5")).toEqual({ gst: 5, taxable: 50, cgst: 1.25, sgst: 1.25, amount: 52.5 });
  });

  test("spreads the bulk discount across slabs", () => {
    const slab = updateGstSlab([line("2"), line("1", { unit_mrp: 50, mrp: 500, gst: 5 })], 7);
    expect(slab.get("12")).toEqual({ gst: 12, taxable: 18, cgst: 1.08, sgst: 1.08, amount: 20.16 });
    expect(slab.get("5")).toEqual({ gst: 5, taxable: 45, cgst: 1.13, sgst: 1.13, amount: 47.25 });
  });
});

describe("calcBulkDiscount", () => {
  test("converts % and ₹ to rupees and caps at the max discount", () => {
    const adj = (discType: ItemDiscountType, disc: string) => ({
      ...EMPTY_INVOICE_ADJUSTMENT,
      discType,
      disc,
    });
    expect(calcBulkDiscount(200, adj("%", "5"), MAX_DISC)).toBe(10);
    expect(calcBulkDiscount(200, adj("%", "50"), MAX_DISC)).toBe(20);
    expect(calcBulkDiscount(200, adj("₹", "15"), MAX_DISC)).toBe(15);
    expect(calcBulkDiscount(200, adj("₹", "150"), MAX_DISC)).toBe(20);
    expect(calcBulkDiscount(200, adj("₹", "-5"), MAX_DISC)).toBe(0);
  });
});

describe("recalcInvoice", () => {
  const items = [line("2"), line("1", { unit_mrp: 50, mrp: 500, gst: 5 })];

  test("rounds net payable and reports the round off", () => {
    const r = recalcInvoice(items, EMPTY_INVOICE_ADJUSTMENT, EMPTY_INVOICE_PAYMENT, MAX_DISC);
    expect(r.totals.netPayable).toBe(74.9);
    expect(r.totals.roundedNetPayable).toBe(75);
    expect(r.adjustment.roundOff).toBe("0.10");
    expect(r.adjustment.disableBulkDisc).toBeUndefined();
    expect(r.adjustment.disableItemsDisc).toBeUndefined();
  });

  test("measures the payment balance against the rounded net payable", () => {
    const r = recalcInvoice(
      items,
      EMPTY_INVOICE_ADJUSTMENT,
      { ...EMPTY_INVOICE_PAYMENT, cash: "50", upi: "30" },
      MAX_DISC,
    );
    expect(r.payment.totalPaid).toBe(80);
    expect(r.payment.balance).toBe(5);
  });

  test("applies a bulk discount and locks item discounts", () => {
    const r = recalcInvoice(
      items,
      { ...EMPTY_INVOICE_ADJUSTMENT, disc: "10" },
      EMPTY_INVOICE_PAYMENT,
      MAX_DISC,
    );
    expect(r.totals).toEqual({
      subTotal: 63,
      gstTotal: 4.41,
      netPayable: 67.41,
      roundedNetPayable: 67,
    });
    expect(r.adjustment.roundOff).toBe("-0.41");
    expect(r.adjustment.disableItemsDisc).toBeDefined();
    expect(r.gstSlab.get("12")?.taxable).toBe(18);
  });

  test("writes back a bulk discount that exceeds the max", () => {
    const pct = recalcInvoice(
      items,
      { ...EMPTY_INVOICE_ADJUSTMENT, disc: "40" },
      EMPTY_INVOICE_PAYMENT,
      MAX_DISC,
    );
    expect(pct.adjustment.disc).toBe("10");
    const flat = recalcInvoice(
      items,
      { ...EMPTY_INVOICE_ADJUSTMENT, discType: "₹", disc: "40" },
      EMPTY_INVOICE_PAYMENT,
      MAX_DISC,
    );
    expect(flat.adjustment.disc).toBe("7");
    expect(flat.totals.subTotal).toBe(63);
  });

  test("locks the bulk discount when an item has a discount", () => {
    const discounted = updateInvoiceItem(items, 0, "disc", "5", MAX_DISC, EMPTY_INVOICE_ADJUSTMENT);
    const r = recalcInvoice(discounted, EMPTY_INVOICE_ADJUSTMENT, EMPTY_INVOICE_PAYMENT, MAX_DISC);
    expect(r.adjustment.disableBulkDisc).toBeDefined();
    expect(r.totals.subTotal).toBe(69);
  });
});
