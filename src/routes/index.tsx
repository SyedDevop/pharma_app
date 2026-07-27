import { createFileRoute } from "@tanstack/react-router";
import { PatientSearch } from "@/components/my-ui/PatientSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Index() {
  return (
    <div className="p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex flex-row gap-2.5">
            <PatientSearch
              title="IPD Patient Search"
              patientFrom="ipd"
              onSelect={(patient) => console.log(patient)}
              placeholder="In-patient No, Name or Mobile number"
            />
            <PatientSearch
              title="OPD Patient Search"
              patientFrom="customer"
              onSelect={(patient) => console.log(patient)}
              placeholder="Out-patient No, Name or Mobile number"
            />
            <PatientSearch
              title="Retail customer Search"
              patientFrom="customer"
              onSelect={(patient) => console.log(patient)}
              placeholder="Name or Mobile Number"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
