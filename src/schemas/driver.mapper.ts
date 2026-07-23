import type {
  TDriver,
  TDriverCreateRequest,
  TDriverFormValues,
  TDriverLicense,
  TDriverLicenseRequest,
  TDriverUpdateRequest,
} from "@/schemas/driver.schema";
import { DRIVER_FORM_DEFAULTS } from "@/schemas/driver.schema";
import { normalizeDriverStatus } from "@/types/enums/driver-status.enum";

export type DriverFormMode = "create" | "edit";

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const todayInputValue = () => new Date().toISOString().slice(0, 10);

export const getDriverFormDefaultValues = (
  mode: DriverFormMode,
  driver?: TDriver
): TDriverFormValues => ({
  fullName: driver?.fullName ?? "",
  email: driver?.email ?? "",
  identityNumber: driver?.identityNumber ?? "",
  phoneNumber: driver?.phoneNumber ?? "",
  dateOfBirth: toDateInputValue(driver?.dateOfBirth),
  joinDate: toDateInputValue(driver?.joinDate) || todayInputValue(),
  status:
    mode === "edit"
      ? normalizeDriverStatus(driver?.status)
      : null,
  includeLicense: mode === "create" ? DRIVER_FORM_DEFAULTS.includeLicense : false,
  licenseNumber: "",
  licenseClass: "",
  issueDate: "",
  expiryDate: "",
});

export const toDriverCreateRequest = (
  values: TDriverFormValues
): TDriverCreateRequest => ({
  fullName: values.fullName.trim(),
  email: values.email.trim(),
  identityNumber: values.identityNumber.trim(),
  phoneNumber: values.phoneNumber.trim(),
  dateOfBirth: values.dateOfBirth,
  joinDate: values.joinDate,
  license: values.includeLicense
    ? {
        licenseNumber: values.licenseNumber!.trim(),
        licenseClass: values.licenseClass!.trim(),
        issueDate: values.issueDate!,
        expiryDate: values.expiryDate!,
      }
    : undefined,
});

export const toDriverUpdateRequest = (
  values: TDriverFormValues,
  originalStatus?: string | number | null
): TDriverUpdateRequest => ({
  fullName: values.fullName.trim(),
  email: values.email.trim(),
  identityNumber: values.identityNumber.trim(),
  phoneNumber: values.phoneNumber.trim(),
  dateOfBirth: values.dateOfBirth,
  joinDate: values.joinDate,
  status:
    normalizeDriverStatus(values.status) !== normalizeDriverStatus(originalStatus)
      ? values.status ?? undefined
      : undefined,
});

export const getDriverLicenseFormDefaultValues = (
  license?: TDriverLicense | null
): TDriverLicenseRequest => ({
  licenseNumber: license?.licenseNumber ?? "",
  licenseClass: license?.licenseClass ?? "",
  issueDate: toDateInputValue(license?.issueDate),
  expiryDate: toDateInputValue(license?.expiryDate),
});

export const toDriverLicenseRequest = (
  values: TDriverLicenseRequest
): TDriverLicenseRequest => ({
  licenseNumber: values.licenseNumber.trim(),
  licenseClass: values.licenseClass.trim(),
  issueDate: values.issueDate,
  expiryDate: values.expiryDate,
});
