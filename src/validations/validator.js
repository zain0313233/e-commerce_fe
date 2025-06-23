export const validator = (formData) => {
  const newErrors = {};

  if (!formData.name?.trim()) {
    newErrors.name = "Full name is required";
  } else if (formData.name.trim().length < 2) {
    newErrors.name = "Name must be at least 2 characters";
  }

  if (!formData.email?.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password = "Password must contain uppercase, lowercase, and number";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (!formData.phone?.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
    newErrors.phone = "Please enter a valid phone number";
  }

  if (!formData.address_line_1?.trim()) {
    newErrors.address_line_1 = "Address is required";
  } else if (formData.address_line_1.trim().length < 5) {
    newErrors.address_line_1 = "Address must be at least 5 characters";
  }

  if (!formData.city?.trim()) {
    newErrors.city = "City is required";
  } else if (formData.city.trim().length < 2) {
    newErrors.city = "City must be at least 2 characters";
  }

  if (!formData.state?.trim()) {
    newErrors.state = "State is required";
  } else if (formData.state.trim().length < 2) {
    newErrors.state = "State must be at least 2 characters";
  }

  if (!formData.postal_code?.trim()) {
    newErrors.postal_code = "Postal code is required";
  } else if (!/^[\d\w\s\-]{3,}$/.test(formData.postal_code)) {
    newErrors.postal_code = "Please enter a valid postal code";
  }

  if (!formData.country?.trim()) {
    newErrors.country = "Country is required";
  } else if (formData.country.trim().length < 2) {
    newErrors.country = "Country must be at least 2 characters";
  }

  if (!formData.role) {
    newErrors.role = "Please select a role";
  } else if (!['customer', 'admin', 'seller', 'moderator', 'support'].includes(formData.role)) {
    newErrors.role = "Please select a valid role";
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};