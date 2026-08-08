type ItemDiscountType = "%" | "₹";
type ScheduleType = "H" | "H1" | "X" | "OTC" | "" | null;
type InvoiceItemFormData = {
  id: string;
  item: string;
  batch: string;
  expiry: string;
  qty: string;
  storeStock: string;
  batchStock: string;
  pack: string;
  packBreakdown: string;
  mrp: string;
  sellRate: string;
  discType: ItemDiscountType;
  disc: string;
  gstPct: string;
  cgst: string;
  sgst: string;
  amount: string;
};

type MedicineItem = {
  id: string;
  name: string;
  hsn: string;
  batch: string;
  barcode: string;
  exp_date: string;
  stock: number;
  store_stock: number;
  total_units: number;
  total_store_units: number;
  mrp: number;
  unit_mrp: number;
  packing_size: number;
  rate: number;
  gst: number;
  packing: string;
  rack: string | null;
  stock_id: number;
  schedule: ScheduleType;
  is_narcotic: number;
};

//{
//id -- "id": 65647,
//item -- "name": "AMLOKIND AT TAB",
//"hsn": "30049099",
//batch -- "batch": "G65Z036",
//"barcode": "VC260729383687",
//expiry -- "exp_date": "2028-02-01",
//"stock": 7,
//"store_stock": 7,
//batchStock -- "total_units": 105,
//storeStock -- "total_store_units": 105,
//mrp -- "mrp": 61.18,
//sellRate -- "unit_mrp": 4.08,
//"packing_size": 15,
//"rate": 61.18,
//gstPet -- "gst": 5,
//"packing": "",
//"rack": null,
//"stock_id": 150580,
//"schedule": "OTC",
//"is_narcotic": 0
//}
