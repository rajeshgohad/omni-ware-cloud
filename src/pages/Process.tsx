import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Process = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Process</h1>
        <p className="text-muted-foreground">Process management and workflows</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process Management</CardTitle>
          <CardDescription>Manage and monitor warehouse processes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Process features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Process;
