import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoutePricingTab from "./components/route-pricing-tab";
import ServicePricingTab from "./components/service-pricing-tab";

const PricingPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Giá dịch vụ</h1>
        <p className="mt-1 text-muted-foreground">
          Quản lý danh mục phí dịch vụ và bảng giá cân nặng theo tuyến.
        </p>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Giá dịch vụ</TabsTrigger>
          <TabsTrigger value="routes">Giá tuyến</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServicePricingTab />
        </TabsContent>
        <TabsContent value="routes">
          <RoutePricingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingPage;
