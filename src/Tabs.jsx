import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    company: '',
    yearsExperience: '0-1',
    skills: '',
};

const initialFormErrors = {
    fullName: null,
    email: null,
    phone: null,
    address: null,
    agreeTerms: null,
};

function Tabs({ activeTabIndex, onPrevious, onNext, onTabClick }) {
    const totalTabs = 3;
    const isFirstTab = activeTabIndex === 0;
    const isLastTab = activeTabIndex === totalTabs - 1;

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- Validation Logic ---
    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'fullName':
                if (!value || value.trim().length <= 2) {
                    error = 'Please enter a valid Name address.';
                }
                break;
            case 'email':
                if (!value || !EMAIL_REGEX.test(value)) {
                    error = 'Please enter a valid email address.';
                }
                break;
            case 'phone':
                if (value && !PHONE_REGEX.test(value)) {
                    error = 'Please enter a valid phone number.';
                }
                break;
            case 'address':
                if (!value || value.trim().length <= 4) {
                    error = 'Please provide your full address.';
                }
                break;
            case 'agreeTerms':
                if (!value) {
                    error = 'You must agree to the terms and conditions.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ 
            ...prevData, 
            [name]: value 
        }));
        if (formErrors[name]) {
            setFormErrors(prevErrors => ({ 
                ...prevErrors, 
                [name]: null 
            }));
        }
    };

    const handleAgreeTermsChange = (e) => {
        setAgreeTerms(e.target.checked);
        if (e.target.checked && formErrors.agreeTerms) {
            setFormErrors(prevErrors => ({ ...prevErrors, agreeTerms: null }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (['fullName', 'email', 'address', 'phone'].includes(name)) {
            const error = validateField(name, value);
            setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        }
    };


    // --- TODO: Step 5 - Create validateCurrentTabForNext function ---
    // This function checks if the current tab's required fields are valid.
    // It should update formErrors for the current tab's fields and return true if valid, false otherwise.
    const validateCurrentTabForNext = () => {
        let currentTabErrors = {}; // Collect errors for current tab here
        let isTabValid = true;

        if (activeTabIndex === 0) { // Personal Info Tab
            const fullNameError = validateField('fullName', formData.fullName);
            if (fullNameError) { 
                currentTabErrors.fullName = fullNameError; 
                isTabValid = false; 
            }
        
            const emailError = validateField('email', formData.email);
            if (emailError) {
                currentTabErrors.email = emailError;
                isTabValid = false;
            }
        
            const addressError = validateField('address', formData.address);
            if (addressError) {
                currentTabErrors.address = addressError;
                isTabValid = false;
            }
        
            const phoneError = validateField('phone', formData.phone);
            if (formData.phone && phoneError) { // An error only if it's filled and invalid
               currentTabErrors.phone = phoneError;
               isTabValid = false; // Or only block if it's a format error on a filled field
            }
        } else if (activeTabIndex === 1) {
            return true;
        }
        // No validation needed for Tab 1 (Experience Tab) to proceed to Tab 2 (Review)

        // Update formErrors state with any errors found on the current tab
        setFormErrors(prevErrors => ({ ...prevErrors, ...currentTabErrors }));
        return isTabValid;
    };


    const handleNextClick = () => {
        if (validateCurrentTabForNext()) {
            onNext();
        }
    };

    const handleTabHeaderClick = (targetIndex) => {
        if (targetIndex > activeTabIndex) { // If trying to move forward
            if (!validateCurrentTabForNext()) {
                return; // Stop navigation if current tab is invalid
            }
        }
        onTabClick(targetIndex); // Allow backward navigation or if forward and valid
    }

    // --- TODO: Step 8 - Create validateAllFieldsForSubmit function ---
    // This function validates ALL required fields across the form before final submission.
    // It should update formErrors for all relevant fields and return true if all valid, false otherwise.
    const validateAllFieldsForSubmit = () => {
        let allSubmissionErrors = {};
        let isFormGloballyValid = true;
    
        const fullNameError = validateField('fullName', formData.fullName);
        if (fullNameError) {
            allSubmissionErrors.fullName = fullNameError;
            isFormGloballyValid = false;
        }
    
        const emailError = validateField('email', formData.email);
        if (emailError) {
            allSubmissionErrors.email = emailError;
            isFormGloballyValid = false;
        }
    
        const addressError = validateField('address', formData.address);
        if (addressError) {
            allSubmissionErrors.address = addressError;
            isFormGloballyValid = false;
        }
    
        if (formData.phone) {
            const phoneError = validateField('phone', formData.phone);
            if (phoneError) {
                allSubmissionErrors.phone = phoneError;
                isFormGloballyValid = false;
            }
        }
    
        const termsError = validateField('agreeTerms', agreeTerms);
        if (termsError) {
            allSubmissionErrors.agreeTerms = termsError;
            isFormGloballyValid = false;
        }
    
        setFormErrors(prevErrors => ({ ...prevErrors, ...allSubmissionErrors }));
        return isFormGloballyValid;
    };
    const handleFormSubmit = () => {
        if (validateAllFieldsForSubmit()) {
            console.log("Form Data Submitted:", formData);
            console.log("Agreed to terms:", agreeTerms);
            setIsSubmitted(true);
        } else {
            console.log("Form has validation errors. Please correct them.");
            console.log(formErrors); // Log the formErrors object
        }
    };

    if (isSubmitted) {
        return (
            <div className="submission-success">
                <h2>Application Submitted Successfully!</h2>
                <p>Thank you, {formData.fullName || "Applicant"}. Your application has been received.</p>
                <p>We will contact you via email ({formData.email || "your provided email"}) if shortlisted.</p>
            </div>
        );
    }

    return (
        <div className="tabs-container">
            <div className="tab-headers">
                {/* Ensure handleTabHeaderClick is used */}
                <button className={`tab-header ${activeTabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabHeaderClick(0)}>1. Personal Info</button>
                <button className={`tab-header ${activeTabIndex === 1 ? 'active' : ''}`} onClick={() => handleTabHeaderClick(1)}>2. Experience</button>
                <button className={`tab-header ${activeTabIndex === 2 ? 'active' : ''}`} onClick={() => handleTabHeaderClick(2)}>3. Review & Submit</button>
            </div>

            <div className="tab-content">
                {activeTabIndex === 0 && (
                    <div>
                        <h2>Personal Information</h2>
                        <p>Please provide your contact details. Fields marked with * are required.</p>
                        <div className="form-section">
                            <label htmlFor="fullName">Full Name: *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                            {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
                        </div>

                        <div className="form-section">
                            <label htmlFor="email">Email Address: *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                            {formData.email && <span className="error-message">{formErrors.email}</span>}
                        </div>

                        <div className="form-section">
                            <label htmlFor="phone">Phone Number (Optional):</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                            {formData.phone && <span className="error-message">{formErrors.phone}</span>}
                        </div>

                        <div className="form-section">
                            <label htmlFor="address">Address: *</label>
                            <textarea
                                id="address"
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            ></textarea>
                            {formData.address && <span className="error-message">{formErrors.address}</span>}                            
                        </div>
                    </div>
                )}
                {activeTabIndex === 1 && ( /* Experience Tab - No changes for validation display here */
                    <div>
                        <h2>Work Experience & Skills</h2>
                        <p>Tell us about your professional background (All fields optional).</p>
                        <div className="form-section">
                            <label htmlFor="jobTitle">Most Recent Job Title:</label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-section">
                            <label htmlFor="company">Company Name:</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-section">
                            <label htmlFor="yearsExperience">Years of Relevant Experience:</label>
                            <select
                                id="yearsExperience"
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleInputChange}
                            >
                                <option value="0-1">0 - 1 Year</option>
                                <option value="1-3">1 - 3 Years</option>
                                <option value="3-5">3 - 5 Years</option>
                                <option value="5-10">5 - 10 Years</option>
                                <option value="10+">10+ Years</option>
                            </select>
                        </div>
                        <div className="form-section">
                            <label htmlFor="skills">Key Skills (comma-separated):</label>
                            <textarea
                                id="skills"
                                name="skills"
                                rows="4"
                                placeholder="e.g., React, Node.js, Agile"
                                value={formData.skills}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>
                )}
                {activeTabIndex === 2 && ( /* Review Tab - Error for agreeTerms will be added in next ques. */
                    <div>
                        <h2>Review Your Application</h2>
                        <p>Please check your details carefully before submitting.</p>
                        <div className="review-section">
                            <h4>Personal Information</h4>
                            <p><strong>Full Name:</strong> {formData.fullName || <em>Not Provided</em>}</p>
                            <p><strong>Email:</strong> {formData.email || <em>Not Provided</em>}</p>
                            <p><strong>Phone:</strong> {formData.phone || <em>Not Provided</em>}</p>
                            <p><strong>Address:</strong> {formData.address || <em>Not Provided</em>}</p>
                        </div>
                        <div className="review-section">
                            <h4>Experience & Skills</h4>
                            <p><strong>Job Title:</strong> {formData.jobTitle || <em>Not Provided</em>}</p>
                            <p><strong>Company:</strong> {formData.company || <em>Not Provided</em>}</p>
                            <p><strong>Years of Experience:</strong> {formData.yearsExperience}</p>
                            <p><strong>Skills:</strong> {formData.skills || <em>Not Provided</em>}</p>
                        </div>
                        <div className="form-section terms-section">
                            <h4>Confirmation *</h4>
                            <label htmlFor="agreeTerms">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    checked={agreeTerms}
                                    onChange={handleAgreeTermsChange}
                                />
                                {' '}I confirm that the information provided is accurate and I agree to the company's terms and conditions.
                            </label>
                            {formErrors.agreeTerms && (
                            <span className="error-message" style={{ display: 'block', marginTop: '5px' }}>
                            {formErrors.agreeTerms}
                             </span>
                       )}
                        </div>
                    </div>
                )}
            </div>
            <div className="tab-navigation">
                <button onClick={onPrevious} disabled={isFirstTab}>Previous</button>
                {isLastTab ? (
                    <button onClick={handleFormSubmit} className="submit-button">Submit Application</button>
                ) : (
                    // Ensure handleNextClick is used
                    <button onClick={handleNextClick}>Next</button>
                )}
            </div>
        </div>
    );
}
export default Tabs;