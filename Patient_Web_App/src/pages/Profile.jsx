import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';
import { Card, Button, Input } from '../components/ui';
import { 
  Mail, Calendar, User, Droplet, Phone, 
  MapPin, Shield, Edit, Save, CheckCircle 
} from '../components/icons/Icons';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedUser = { ...user, ...formData };
    const result = await apiService.updateProfile(updatedUser);
    if (result.success) {
      updateUser(updatedUser);
      setEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setSaving(false);
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100">
      {Icon && <div className="text-primary-600"><Icon size={18} /></div>}
      <div className="flex-1">
        <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-neutral-800">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">My Profile</h1>
        <p className="text-neutral-500">View and update your personal information</p>
      </div>

      {successMessage && (
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl mb-5 flex items-center gap-2.5 text-primary-700 text-sm">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      {/* Profile Header */}
      <Card className="mb-5">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 py-8 px-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold mb-4">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <h2 className="text-white text-xl font-bold mb-1">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-primary-100 text-sm">Patient ID: {user?.id}</p>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="mb-5 p-6">
        <h3 className="text-base font-semibold text-neutral-800 mb-4">Personal Information</h3>
        <InfoRow label="Email" value={user?.email} icon={Mail} />
        <InfoRow label="Date of Birth" value={user?.dateOfBirth} icon={Calendar} />
        <InfoRow label="Gender" value={user?.gender} icon={User} />
        <InfoRow label="Blood Type" value={user?.bloodType} icon={Droplet} />
      </Card>

      {/* Contact Information */}
      <Card className="mb-5 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-neutral-800">Contact Information</h3>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Edit size={16} /> Edit
            </Button>
          )}
        </div>

        {editing ? (
          <div>
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              icon={Phone}
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              icon={MapPin}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input label="City" value={formData.city} onChange={handleChange('city')} />
              <Input label="State" value={formData.state} onChange={handleChange('state')} />
              <Input label="ZIP" value={formData.zipCode} onChange={handleChange('zipCode')} />
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <InfoRow label="Phone" value={user?.phone} icon={Phone} />
            <InfoRow label="Address" value={user?.address} icon={MapPin} />
            <InfoRow label="City" value={`${user?.city}, ${user?.state} ${user?.zipCode}`} />
          </>
        )}
      </Card>

      {/* Emergency Contact */}
      <Card className="mb-5 p-6">
        <h3 className="text-base font-semibold text-neutral-800 mb-4">Emergency Contact</h3>
        {editing ? (
          <>
            <Input
              label="Contact Name"
              value={formData.emergencyContact}
              onChange={handleChange('emergencyContact')}
              icon={User}
            />
            <Input
              label="Contact Phone"
              value={formData.emergencyPhone}
              onChange={handleChange('emergencyPhone')}
              icon={Phone}
            />
          </>
        ) : (
          <>
            <InfoRow label="Contact Name" value={user?.emergencyContact} icon={User} />
            <InfoRow label="Contact Phone" value={user?.emergencyPhone} icon={Phone} />
          </>
        )}
      </Card>

      {/* Insurance */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-neutral-800 mb-4">Insurance Information</h3>
        <InfoRow label="Insurance Provider" value={user?.insurance} icon={Shield} />
        <InfoRow label="Insurance ID" value={user?.insuranceId} />
      </Card>
    </div>
  );
};

export default Profile;