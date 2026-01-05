import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardRow } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, ArrowLeft } from 'lucide-react';

export const CaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const res = await api.get(`/onboarding/${id}`);
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch detail:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-brand-600" /></div>;
    if (!data) return <div className="p-8 text-center">Case not found.</div>;

    const { triageResult, caseStatus, userId, answers, createdAt } = data;
    const user = userId || {};

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/cases')}
                    className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cases
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Case Details</h1>
                        <p className="text-sm text-slate-500 font-mono mt-1">ID: {id}</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Potential actions here in future */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* A) CASE SUMMARY */}
                <Card title="Case Summary" className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <dt className="text-xs font-medium text-slate-500 mb-2">Priority</dt>
                            <Badge variant={triageResult?.priority}>{triageResult?.priority || 'LOW'}</Badge>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-slate-500 mb-2">Status</dt>
                            <Badge variant={caseStatus}>{caseStatus}</Badge>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-slate-500 mb-2">Consultation</dt>
                            <dd className="font-medium text-slate-900">{triageResult?.consultation_offered ? "✅ Offered" : "No"}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-slate-500 mb-2">Submitted</dt>
                            <dd className="font-medium text-slate-900">{new Date(createdAt).toLocaleDateString()}</dd>
                        </div>
                    </div>
                </Card>

                {/* B) CLIENT INFORMATION */}
                <Card title="Client Information">
                    <div className="mb-4">
                        <dt className="text-xs font-medium text-slate-500 mb-1">Email</dt>
                        <a href={`mailto:${user.email}`} className="text-brand-600 hover:underline font-medium">{user.email}</a>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <CardRow label="First Name" value={user.firstName} />
                        <CardRow label="Last Name" value={user.lastName} />
                    </div>
                    <CardRow label="User ID" value={user._id} fullWidth />
                </Card>

                {/* C) INCIDENT OVERVIEW */}
                <Card title="Incident Overview">
                    <div className="mb-4">
                        <dt className="text-xs font-medium text-slate-500 mb-2">Incident Types</dt>
                        <div className="flex flex-wrap gap-2">
                            {answers?.incidentTypes?.map(t => (
                                <span key={t} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">{t}</span>
                            ))}
                        </div>
                    </div>
                    <CardRow label="Date Range" value={answers?.incidentDateRange} />
                    <div className="mt-4">
                        <dt className="text-xs font-medium text-slate-500 mb-1">Description</dt>
                        <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded border border-slate-100 italic">
                            "{answers?.incidentDescription}"
                        </p>
                    </div>
                </Card>

                {/* D) WORK & DAILY IMPACT */}
                <Card title="Work & Daily Life">
                    <CardRow label="Ability to Work" value={answers?.abilityToWork?.[0]} />
                    <div className="mb-6">
                        <dt className="text-xs font-medium text-slate-500 mb-1">Work Details</dt>
                        <dd className="text-sm text-slate-700">{answers?.abilityToWorkDetails || '-'}</dd>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                        <dt className="text-xs font-medium text-slate-500 mb-2">Activities Affected</dt>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {answers?.dailyActivitiesAffected?.map(a => (
                                <span key={a} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs border border-red-100">{a}</span>
                            ))}
                        </div>
                        <CardRow label="Details" value={answers?.dailyActivitiesDetails} fullWidth />
                    </div>
                </Card>

                {/* E) EMOTIONAL STATE */}
                <Card title="Emotional State">
                    <div className="mb-6">
                        <dt className="text-xs font-medium text-slate-500 mb-2">Symptoms</dt>
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                            {answers?.emotionalSymptoms?.map(s => <li key={s}>{s}</li>)}
                            {!answers?.emotionalSymptoms?.length && <li className="text-slate-400">None listed</li>}
                        </ul>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-slate-500 mb-1">What Client Wants Next</dt>
                        <p className="text-sm text-slate-700 bg-brand-50/50 p-3 rounded border border-brand-100">
                            {answers?.feelingsNext?.join(', ') || '-'}
                        </p>
                    </div>
                </Card>

                {/* F) LEGAL & MEDICAL */}
                <Card title="Legal & Medical">
                    <div className="grid grid-cols-2 gap-4">
                        <CardRow label="Has Lawyer?" value={answers?.hasLawyer} />
                        <CardRow label="In Therapy?" value={answers?.inTherapy} />
                    </div>
                    {answers?.hasLawyer === 'Yes' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <CardRow label="Lawyer Details" value={answers?.lawyerDetails} fullWidth />
                        </div>
                    )}
                </Card>

                {/* G) NOTIFICATIONS */}
                <Card title="Notifications (Read-Only)">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">🔔 Reminders</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${answers?.notifications?.reminders ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {answers?.notifications?.reminders ? 'ON' : 'OFF'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">📺 Webinars</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${answers?.notifications?.webinars ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {answers?.notifications?.webinars ? 'ON' : 'OFF'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-600">🎁 Promotions</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${answers?.notifications?.promotions ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {answers?.notifications?.promotions ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
};
