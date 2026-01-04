import React, { useState } from 'react';
import { Modal, Input, Button } from '../ui/LayoutComponents';
import { CATEGORIES } from '../../types';
import { Plus } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    onAdd({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description
    });
    
    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Grocery Run"
          autoFocus
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <Input
          label="Category"
          as="select"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
          ))}
        </Input>

        <Input
          label="Description (Optional)"
          as="textarea"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add some details..."
          className="min-h-[80px]"
        />

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" icon={<Plus size={18} />}>
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};