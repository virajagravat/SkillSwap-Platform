import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * Modal dialog for sending a skill‑swap request.
 *
 * Props:
 * - open: boolean – whether the dialog is visible
 * - onClose: () => void – called when the dialog should be dismissed
 * - teacherId: string – the receiver (teacher) user id – obtained from JWT on backend
 * - teacherName: string – displayed for context
 * - skillId: string – id of the skill being requested
 * - skillName: string – displayed for context
 * - onConfirm: (payload) => Promise – called with the request payload; the parent
 *   component will handle the API call and toast handling.
 */
export const SwapRequestDialog = ({
  open,
  onClose,
  teacherId,
  teacherName,
  skillId,
  skillName,
  onConfirm,
}) => {
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedStartTime, setRequestedStartTime] = useState('');
  const [requestedEndTime, setRequestedEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setRequestedDate('');
    setRequestedStartTime('');
    setRequestedEndTime('');
    setMessage('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!requestedDate) newErrors.requestedDate = 'Date is required';
    if (!requestedStartTime) newErrors.requestedStartTime = 'Start time is required';
    if (!requestedEndTime) newErrors.requestedEndTime = 'End time is required';
    if (requestedStartTime && requestedEndTime && requestedEndTime <= requestedStartTime) {
      newErrors.timeOrder = 'End time must be after start time';
    }
    if (message.length > 500) newErrors.message = 'Message must be ≤ 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;
    const payload = {
      skillId,
      receiverId: teacherId,
      requestedDate,
      requestedStartTime,
      requestedEndTime,
      message: message.trim(),
    };
    try {
      setIsSubmitting(true);
      await onConfirm(payload);
    } finally {
      setIsSubmitting(false);
      resetForm();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-surface-border-dark dark:bg-surface-dark">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-surface-border-dark">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-50">Send Swap Request</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Request <strong>{skillName}</strong> from <strong>{teacherName}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
            />
            {errors.requestedDate && (
              <p className="text-xs text-red-600 mt-1">{errors.requestedDate}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <Input
                type="time"
                value={requestedStartTime}
                onChange={(e) => setRequestedStartTime(e.target.value)}
              />
              {errors.requestedStartTime && (
                <p className="text-xs text-red-600 mt-1">{errors.requestedStartTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="time"
                value={requestedEndTime}
                onChange={(e) => setRequestedEndTime(e.target.value)}
              />
              {errors.requestedEndTime && (
                <p className="text-xs text-red-600 mt-1">{errors.requestedEndTime}</p>
              )}
            </div>
          </div>
          {errors.timeOrder && (
            <p className="text-xs text-red-600">{errors.timeOrder}</p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Message (optional)</label>
            <textarea
              placeholder="Add a note (max 500 characters)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 dark:border-surface-border-dark dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {errors.message && (
              <p className="text-xs text-red-600 mt-1">{errors.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-surface-border-dark">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>Send Request</Button>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestDialog;
