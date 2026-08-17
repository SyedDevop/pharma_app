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
     - Affected Invoice: `VC-26-27/35148`
        ```sql
        SELECT
            ps.invoice_no,
            -- Values stored in pharma_sales
            ps.sub_total,
            ps.discount_type,
            ps.discount_value,
            ps.tax_total AS invoice_gst,
            ps.round_off,
            ps.net_total AS 'Paid/NetTotal',
            -- Calculated from pharma_sale_items
            SUM(psi.taxable_amount) AS items_taxable_total,
            SUM(psi.gst_amount) AS items_gst_total,
            SUM(psi.cgst_amount) AS items_cgst_total,
            SUM(psi.sgst_amount) AS items_sgst_total,
            SUM(psi.line_total) AS items_line_total,
            -- Differences
            ROUND(ps.tax_total - SUM(psi.gst_amount), 2) AS gst_difference,
            ROUND(ps.net_total - SUM(psi.line_total), 2) AS total_difference,
            -- Difference descriptions
            CASE
                WHEN ROUND(ps.tax_total - SUM(psi.gst_amount), 2) > 0
                    THEN 'Invoice GST is higher than Item GST'
                WHEN ROUND(ps.tax_total - SUM(psi.gst_amount), 2) < 0
                    THEN 'Item GST is higher than Invoice GST'
                ELSE 'GST matches'
            END AS gst_comparison,
            CASE
                WHEN ROUND(ps.net_total - SUM(psi.line_total), 2) > 0
                    THEN 'Invoice Net Total is higher than Item Total'
                WHEN ROUND(ps.net_total - SUM(psi.line_total), 2) < 0
                    THEN 'Item Total is higher than Invoice Net Total'
                ELSE 'Net Total matches'
            END AS total_comparison
        FROM pharma_sales ps
        JOIN pharma_sale_items psi ON psi.sale_id = ps.id
        WHERE ps.invoice_no = 'VC-26-27/35148'
        GROUP BY
            ps.id,
            ps.invoice_no,
            ps.sub_total,
            ps.discount_type,
            ps.discount_value,
            ps.tax_total,
            ps.round_off,
            ps.net_total;
        ```
