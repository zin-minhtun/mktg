import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, Loader2 } from 'lucide-react';

export const CaseList = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await api.get('/onboarding/all');
            setCases(res.data);
        } catch (err) {
            console.error("Failed to fetch cases:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCases = cases.filter(c => {
        // CRITICAL: Only show cases with a valid userId (completed signups)
        if (!c.userId || !c.userId._id) return false;

        const matchesPriority = filterPriority === 'ALL' || (c.triageResult?.priority === filterPriority);
        const matchesStatus = filterStatus === 'ALL' || (c.caseStatus === filterStatus);

        // Safety check for user/email existence
        const email = c.userId?.email || '';
        const matchesSearch = search === '' || email.toLowerCase().includes(search.toLowerCase());

        return matchesPriority && matchesStatus && matchesSearch;
    });

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600 h-8 w-8" /></div>;

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
                    <p className="text-sm text-slate-500">Manage triage and onboarding cases.</p>
                </div>
                <button onClick={fetchCases} className="text-brand-600 font-medium text-sm hover:underline">Refresh</button>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px] relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by client email..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="COURTESY">Courtesy</option>
                        <option value="MESSAGE">Message Only</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SIGNED">Signed</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Consultation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredCases.map((c) => (
                            <tr
                                key={c._id}
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                                onClick={() => navigate(`/cases/${c._id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={c.triageResult?.priority}>{c.triageResult?.priority || 'LOW'}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={c.caseStatus}>{c.caseStatus?.replace('_', ' ') || 'New'}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{c.userId?.firstName} {c.userId?.lastName}</div>
                                    <div className="text-sm text-slate-500">{c.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {c.triageResult?.consultation_offered ? (
                                        <span className="text-emerald-600 font-medium">Offered</span>
                                    ) : (
                                        <span className="text-slate-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredCases.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    No cases found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
