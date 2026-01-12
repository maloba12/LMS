'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, CreditCard, Upload, CheckCircle, X } from 'lucide-react';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
}

interface ManualCompanyRegistrationFormProps {
  plans: SubscriptionPlan[];
}

export default function ManualCompanyRegistrationForm({ plans }: ManualCompanyRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Company Information
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pacraNumber, setPacraNumber] = useState('');
  const [bozLicenseNumber, setBozLicenseNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Contact Person Information
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Account Information
  const [accountEmail, setAccountEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  // Subscription
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly'>('monthly');

  // Documents
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
    setDocumentTypes(prev => [...prev, ...files.map(() => 'other')]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    setDocumentTypes(prev => prev.filter((_, i) => i !== index));
  };

  const updateDocumentType = (index: number, type: string) => {
    setDocumentTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = type;
      return newTypes;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }

    if (!accountEmail || !tempPassword) {
      setError('Account email and temporary password are required');
      return;
    }

    setLoading(true);

    try {
      // First, upload documents if any
      let uploadedDocumentUrls: string[] = [];
      if (documents.length > 0) {
        const formData = new FormData();
        documents.forEach((doc, index) => {
          formData.append('files', doc);
          formData.append('types', documentTypes[index]);
        });

        const uploadRes = await fetch('/api/documents/upload-multiple', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedDocumentUrls = uploadData.urls || [];
        }
      }

      // Register the company
      const res = await fetch('/api/admin/manual-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Company info
          companyName,
          email: email || accountEmail,
          phone,
          address,
          pacraNumber,
          bozLicenseNumber,
          description,
          category,
          websiteUrl,
          // Contact person
          contactName,
          contactEmail,
          contactPhone,
          // Account
          accountEmail,
          tempPassword,
          // Subscription
          planId: selectedPlan,
          subscriptionType,
          // Documents
          documentUrls: uploadedDocumentUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('Company registered successfully! The vendor account has been created and is ready to use.');
      // Reset form
      setCompanyName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPacraNumber('');
      setBozLicenseNumber('');
      setDescription('');
      setCategory('');
      setWebsiteUrl('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setAccountEmail('');
      setTempPassword('');
      setSelectedPlan(null);
      setDocuments([]);
      setDocumentTypes([]);

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Company Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PACRA Number *</label>
            <input
              type="text"
              value={pacraNumber}
              onChange={(e) => setPacraNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bank of Zambia License</label>
            <input
              type="text"
              value={bozLicenseNumber}
              onChange={(e) => setBozLicenseNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            >
              <option value="">Select category</option>
              <option value="commercial_bank">Commercial Bank</option>
              <option value="microfinance">Microfinance Institution</option>
              <option value="digital_lender">Digital Lender</option>
              <option value="sacco">SACCO/Cooperative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Company Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              placeholder="Describe your company, services, and target customers..."
            />
          </div>
        </div>
      </div>

      {/* Contact Person */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contact Person</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
            />
          </div>
        </div>
      </div>

      {/* Account Setup */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Account Setup</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Email *</label>
            <input
              type="email"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
            <p className="mt-1 text-xs text-gray-500">This will be used for login</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Temporary Password *</label>
            <input
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
              required
            />
            <p className="mt-1 text-xs text-gray-500">User can change this later</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Subscription Plan</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="subscriptionType"
                value="monthly"
                checked={subscriptionType === 'monthly'}
                onChange={(e) => setSubscriptionType(e.target.value as 'monthly' | 'yearly')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Monthly</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="subscriptionType"
                value="yearly"
                checked={subscriptionType === 'yearly'}
                onChange={(e) => setSubscriptionType(e.target.value as 'monthly' | 'yearly')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Yearly (Save 20%)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{plan.name}</h4>
                  {selectedPlan === plan.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                <div className="text-lg font-bold">
                  ZMW {subscriptionType === 'monthly' ? plan.price_monthly : plan.price_yearly}
                  <span className="text-sm font-normal text-gray-500">/{subscriptionType === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">Upload PACRA certificate, business license, or other relevant documents</p>
          </div>

          {documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">{doc.name}</span>
                    <span className="text-xs text-gray-500">({(doc.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={documentTypes[index]}
                      onChange={(e) => updateDocumentType(index, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pacra">PACRA Certificate</option>
                      <option value="license">Business License</option>
                      <option value="id">ID Document</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Registering Company...' : 'Register Company'}
        </button>
      </div>
    </form>
  );
}
