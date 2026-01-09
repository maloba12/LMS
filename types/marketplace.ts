export interface Vendor {
    id: number;
    name: string;
    description: string;
    logo_url?: string;
    category: 'commercial_bank' | 'microfinance' | 'digital_lender' | 'sacco' | 'cooperative';
    address?: string;
    contact_email?: string;
    contact_phone?: string;
    website_url?: string;
    rating?: number;
    review_count?: number;
}

export interface LoanProduct {
    id: number;
    vendor_id: number;
    name: string;
    description: string;
    loan_type: 'personal_loan' | 'salary_advance' | 'sme_loan' | 'school_fees_loan' | 'mortgage' | 'asset_financing' | 'other';
    min_amount: number;
    max_amount: number;
    min_tenure_months: number;
    max_tenure_months: number;
    interest_rate: number;
    interest_type: 'flat' | 'reducing_balance';
    processing_fee_percent: number;
    min_income_requirement?: number;
    eligibility_criteria?: string;
    currency: string;
}
