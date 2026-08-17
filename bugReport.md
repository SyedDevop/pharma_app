# Bug Report

<!--toc:start-->
- [Bug Report](#bug-report)
  - [[WebSite](https://vcarehospital.in/hmsversion8.2/pharma/sale/invoice.php)](#websitehttpsvcarehospitalinhmsversion82pharmasaleinvoicephp)
<!--toc:end-->

## [WebSite](https://vcarehospital.in/hmsversion8.2/pharma/sale/invoice.php)

  1) Per Item base discount not calculating correctly for qty > 1.
  2) Bulk Discount Calculation
     - Bulk discount is currently applied to the Net Payable amount.
     - It should be applied to the Taxable Amount instead.
     - GST should be recalculated based on the discounted taxable amount.
     - The adjusted GST and discount should be reflected correctly in the Net Payable.
     - Currently, the pharma_sale_items calculations do not account for the
       bulk discount correctly, causing a mismatch between item totals and the
       invoice total.
     - Affected Invoice: [`VC-26-27/35148` Link](https://vcarehospital.in/hmsversion8.2/pharma/sale/invoice_reconciliation.php?invoice_no=VC-26-27%2F35148)
