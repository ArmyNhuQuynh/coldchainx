import type {
  TServiceCatalog,
  TServiceCatalogFormValues,
} from "@/schemas/service-catalog.schema";

export type ServiceCatalogFormState = {
  serviceCode: string;
  serviceName: string;
  description: string;
  defaultPrice: string;
  isMandatory: boolean;
  isActive: boolean;
};

export type ServiceCatalogFormErrors = Partial<
  Record<keyof ServiceCatalogFormState, string>
>;

export const EMPTY_SERVICE_CATALOG_FORM: ServiceCatalogFormState = {
  serviceCode: "",
  serviceName: "",
  description: "",
  defaultPrice: "0",
  isMandatory: false,
  isActive: true,
};

export const toServiceCatalogFormState = (
  service?: TServiceCatalog | null
): ServiceCatalogFormState => ({
  serviceCode: service?.serviceCode ?? EMPTY_SERVICE_CATALOG_FORM.serviceCode,
  serviceName: service?.serviceName ?? EMPTY_SERVICE_CATALOG_FORM.serviceName,
  description: service?.description ?? EMPTY_SERVICE_CATALOG_FORM.description,
  defaultPrice: String(
    service?.defaultPrice ?? EMPTY_SERVICE_CATALOG_FORM.defaultPrice
  ),
  isMandatory:
    service?.isMandatory ?? EMPTY_SERVICE_CATALOG_FORM.isMandatory,
  isActive: service?.isActive ?? EMPTY_SERVICE_CATALOG_FORM.isActive,
});

export const parseServiceCatalogForm = (
  values: ServiceCatalogFormState
): TServiceCatalogFormValues => ({
  serviceCode: values.serviceCode,
  serviceName: values.serviceName,
  description: values.description.trim() || undefined,
  defaultPrice:
    values.defaultPrice.trim() === "" ? Number.NaN : Number(values.defaultPrice),
  isMandatory: values.isMandatory,
  isActive: values.isActive,
});

export const collectServiceCatalogFormErrors = (
  issues: Array<{ path: PropertyKey[]; message: string }>
): ServiceCatalogFormErrors =>
  issues.reduce<ServiceCatalogFormErrors>((result, issue) => {
    const key = issue.path[0] as keyof ServiceCatalogFormState | undefined;
    if (key && !result[key]) {
      result[key] = issue.message;
    }
    return result;
  }, {});
