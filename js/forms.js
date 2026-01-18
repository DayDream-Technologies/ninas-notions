/* ==========================================
   Nina's Notions - Form Handling
   ========================================== */

class FormHandler {
  constructor() {
    this.forms = document.querySelectorAll('[data-form]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearError(field));
      });
    });

    // Initialize any inline newsletter forms
    this.initNewsletterForms();
  }

  initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (this.validateEmail(emailInput.value)) {
          this.showSuccess(form, 'Thank you for subscribing! Check your inbox for confirmation.');
          emailInput.value = '';
        } else {
          this.showError(emailInput, 'Please enter a valid email address');
        }
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formType = form.dataset.form;
    
    // Validate all fields
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      if (window.utils) {
        window.utils.showToast('Please fix the errors in the form', 'error');
      }
      return;
    }

    // Handle different form types
    switch (formType) {
      case 'contact':
        this.handleContactForm(form);
        break;
      case 'newsletter':
        this.handleNewsletterForm(form);
        break;
      case 'register':
        this.handleRegistrationForm(form);
        break;
      default:
        this.handleGenericForm(form);
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'This field is required';
      isValid = false;
    }
    // Email validation
    else if (type === 'email' && value && !this.validateEmail(value)) {
      errorMessage = 'Please enter a valid email address';
      isValid = false;
    }
    // Phone validation
    else if (type === 'tel' && value && !this.validatePhone(value)) {
      errorMessage = 'Please enter a valid phone number';
      isValid = false;
    }
    // Min length
    else if (field.minLength > 0 && value.length < field.minLength) {
      errorMessage = `Must be at least ${field.minLength} characters`;
      isValid = false;
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }

    return isValid;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePhone(phone) {
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  showError(field, message) {
    this.clearError(field);
    field.classList.add('form-input--error');
    
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorEl);
  }

  clearError(field) {
    field.classList.remove('form-input--error');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showSuccess(form, message) {
    // Remove any existing success message
    const existingSuccess = form.querySelector('.form-success-message');
    if (existingSuccess) existingSuccess.remove();

    const successEl = document.createElement('div');
    successEl.className = 'form-success-message alert alert--success';
    successEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    
    form.insertBefore(successEl, form.firstChild);
    
    // Scroll to success message
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate sending (in real implementation, this would be an API call)
    this.simulateSubmission(form, () => {
      this.showSuccess(form, 'Thank you for your message! We\'ll get back to you within 24-48 hours.');
      form.reset();
      if (window.utils) {
        window.utils.showToast('Message sent successfully!', 'success');
      }
    });
  }

  handleNewsletterForm(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    this.simulateSubmission(form, () => {
      this.showSuccess(form, 'Thank you for subscribing! Check your inbox for a confirmation email.');
      form.reset();
      if (window.utils) {
        window.utils.showToast('Successfully subscribed!', 'success');
      }
    });
  }

  handleRegistrationForm(form) {
    const formData = new FormData(form);
    const className = formData.get('class-name') || 'the class';
    
    this.simulateSubmission(form, () => {
      this.showSuccess(form, `You've been registered for ${className}! Check your email for confirmation and payment details.`);
      form.reset();
      if (window.utils) {
        window.utils.showToast('Registration successful!', 'success');
      }
    });
  }

  handleGenericForm(form) {
    this.simulateSubmission(form, () => {
      this.showSuccess(form, 'Form submitted successfully!');
      form.reset();
      if (window.utils) {
        window.utils.showToast('Submitted successfully!', 'success');
      }
    });
  }

  simulateSubmission(form, callback) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    
    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> Sending...';
    }

    // Simulate API delay
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      callback();
    }, 1500);
  }
}

// Form-specific styles (injected)
const formStyles = `
  .form-success-message {
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-error {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-error);
    font-size: var(--text-sm);
    margin-top: var(--space-xs);
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  /* Email signup inline form */
  .newsletter-form {
    display: flex;
    gap: var(--space-sm);
    max-width: 400px;
  }

  .newsletter-form input {
    flex: 1;
  }

  @media (max-width: 480px) {
    .newsletter-form {
      flex-direction: column;
    }
  }
`;

// Inject form styles
const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formStyles;
document.head.appendChild(formStyleSheet);

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
  window.formHandler = new FormHandler();
});

