import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "../ui/item";

export function InvoiceHistory() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Previous Invoices</CardTitle>
        <CardDescription>View all previous invoices generated for this patient.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>All Invoices Settled</div>

        <ItemGroup className="grid grid-cols-4 gap-4">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Total Invoices</ItemTitle>
              <ItemDescription>11 settled</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
