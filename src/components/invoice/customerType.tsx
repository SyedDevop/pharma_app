import {
  HospitalIcon,
  IdentificationBadgeIcon,
  ShieldStarIcon,
  ShoppingCartIcon,
  UserListIcon,
} from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useInvoiceStore } from "@/store/invoice_db";
import { PaField } from "../my-ui/paFiels";

const tabs = [
  {
    value: "retail",
    label: "Retail",
    icon: ShoppingCartIcon,
    active: "data-[active]:text-blue-600 data-[active]:border-blue-600",
  },
  {
    value: "b2b",
    label: "B2B",
    icon: HospitalIcon,
    active: "data-[active]:text-violet-600 data-[active]:border-violet-600",
  },
  {
    value: "staff",
    label: "Staff",
    icon: IdentificationBadgeIcon,
    active: "data-[active]:text-success data-[active]:border-success",
  },
  {
    value: "insurance",
    label: "Insurance",
    icon: ShieldStarIcon,
    active: "data-[active]:warning data-[active]:border-warning",
  },
];
export function CustomerType() {
  const ct = useInvoiceStore((s) => s.customerType);
  const setCT = useInvoiceStore((s) => s.setCustomerType);

  return (
    <div>
      <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
        <UserListIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Customer Type
        </h2>
      </div>

      <Tabs value={ct} onValueChange={setCT}>
        <TabsList className="w-full gap-1">
          {tabs.map(({ value, label, icon: Icon, active }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "border-transparent border-b-2 p-3 text-base transition-colors hover:text-primary",
                active,
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <CustomerTypeForm />
      </Tabs>
    </div>
  );
}

export function CustomerTypeForm() {
  const form = useInvoiceStore((s) => s.customerTypeForm);
  const set = useInvoiceStore((s) => s.updateCustomerField);

  return (
    <>
      <TabsContent value="retail">
        <div className="grid grid-cols-3 gap-4">
          <PaField
            id="previous_due"
            label="Previous Due"
            value={form.retail.previous_due}
            type="number"
            onChange={(v) => set("retail", "previous_due", v.target.value)}
            className="no-spinner"
          />
          <PaField
            id="advance_available"
            label="Advance Available"
            type="number"
            value={form.retail.advance_available}
            onChange={(v) => set("retail", "advance_available", v.target.value)}
            className="no-spinner"
          />
          <PaField
            id="advance_applied"
            label="Advance Applied"
            type="number"
            value={form.retail.advance_applied}
            onChange={(v) => set("retail", "advance_applied", v.target.value)}
            className="no-spinner"
          />
        </div>
      </TabsContent>

      <TabsContent value="b2b">
        <div className="grid grid-cols-2 gap-4">
          <PaField
            id="b2b_name"
            label="Company Name"
            value={form.b2b.name}
            onChange={(v) => set("b2b", "name", v.target.value)}
          />
          <PaField
            id="gstin"
            label="GSTIN"
            value={form.b2b.gstin}
            onChange={(v) => set("b2b", "gstin", v.target.value)}
          />
          <PaField
            wrapperClassName="col-span-2"
            id="b2b_address"
            label="Business Address"
            value={form.b2b.address}
            onChange={(v) => set("b2b", "address", v.target.value)}
            multiline
          />
        </div>
      </TabsContent>

      <TabsContent value="staff">
        <div className="grid grid-cols-3 gap-4">
          <PaField
            id="employee_id"
            label="Employee ID"
            value={form.staff.employee_id}
            onChange={(v) => set("staff", "employee_id", v.target.value)}
          />
          <PaField
            id="staff_name"
            label="Name"
            value={form.staff.name}
            onChange={(v) => set("staff", "name", v.target.value)}
            disabled
          />
          <PaField
            id="department"
            label="Department"
            value={form.staff.department}
            onChange={(v) => set("staff", "department", v.target.value)}
            disabled
          />
        </div>
      </TabsContent>

      <TabsContent value="insurance">
        <div className="grid grid-cols-4 gap-4">
          <PaField
            id="company"
            label="Insurance Company"
            value={form.insurance.company}
            onChange={(v) => set("insurance", "company", v.target.value)}
          />
          <PaField
            id="policy_tpa"
            label="Policy / TPA"
            value={form.insurance.policy_tpa}
            onChange={(v) => set("insurance", "policy_tpa", v.target.value)}
          />
          <PaField
            id="auth_code"
            label="Auth Code"
            value={form.insurance.auth_code}
            onChange={(v) => set("insurance", "auth_code", v.target.value)}
          />
          <PaField
            id="coverage_amount"
            label="Coverage Amount"
            value={form.insurance.coverage_amount}
            onChange={(v) => set("insurance", "coverage_amount", v.target.value)}
            type="number"
            className="no-spinner"
          />
        </div>
      </TabsContent>
    </>
  );
}
