const path = require('path');
const User = require("../models/userModel");
const Onboarding = require("../models/onboardingModel");

/**
 * Initialize AdminJS and mount it on the given Express app.
 * This uses dynamic imports because AdminJS is ESM-only.
 */
const initAdmin = async (app) => {
    try {
        const { default: AdminJS, ComponentLoader } = await import("adminjs");
        const AdminJSExpress = await import("@adminjs/express");
        const AdminJSMongoose = await import("@adminjs/mongoose");

        AdminJS.registerAdapter(AdminJSMongoose);

        // 1️⃣ Create ComponentLoader
        const componentLoader = new ComponentLoader();

        // 2️⃣ Register Custom Components
        const Components = {
            PriorityBadge: componentLoader.add('PriorityBadge', path.resolve(__dirname, './components/PriorityBadge.jsx')),
        };

        // --- Onboarding Resource Configuration ---
        const OnboardingResource = {
            resource: Onboarding,
            options: {
                navigation: {
                    name: "Triage & Cases",
                    icon: "Clipboard"
                },
                sort: {
                    sortBy: 'triageResult.priority',
                    direction: 'desc',
                },
                // FILTER: Only show onboarding records with userId (completed signups)
                query: async (context) => {
                    return {
                        userId: { $exists: true, $ne: null }
                    };
                },

                // ====================================
                // 📋 LIST VIEW - Scannable High-Priority
                // ====================================
                listProperties: [
                    "triageResult.priority",              // 🔴 Badge
                    "caseStatus",                          // 📂 Status
                    "triageResult.consultation_offered",  // 🩺 Consult?
                    "userId",                              // 👤 Client Profile
                    "createdAt",                           // 🕒 Submitted
                ],

                // ====================================
                // 📄 SHOW VIEW - Hierarchy & Insights
                // ====================================
                showProperties: [
                    // --- Case Summary ---
                    "triageResult.priority",
                    "caseStatus",
                    "triageResult.consultation_offered",
                    "createdAt",

                    // --- Client ---
                    "userId",

                    // --- Incident ---
                    "answers.incidentTypes",
                    "answers.incidentDateRange",
                    "answers.incidentDescription",

                    // --- Work & Daily Life ---
                    "answers.abilityToWork",
                    "answers.abilityToWorkDetails",
                    "answers.dailyActivitiesAffected",
                    "answers.dailyActivitiesDetails",

                    // --- Emotional & Recovery ---
                    "answers.emotionalSymptoms",
                    "answers.feelingsNext",

                    // --- Legal & Medical ---
                    "answers.hasLawyer",
                    "answers.lawyerDetails",
                    "answers.inTherapy",

                    // --- Notifications (Read Only) ---
                    "answers.notifications.reminders",
                    "answers.notifications.webinars",
                    "answers.notifications.promotions",
                ],

                // Edit view restricted to status management
                editProperties: ["caseStatus"],

                // ====================================
                // 🎨 PROPERTY VISUALS
                // ====================================
                properties: {
                    // ------------------------------------
                    // 🔴 PRIORITY & STATUS
                    // ------------------------------------
                    "triageResult.priority": {
                        label: "⚠️ TRIAGE PRIORITY",
                        isTitle: true,
                        position: 1,
                        availableValues: [
                            { value: "HIGH", label: "🔴 HIGH PRIORITY - ACTION NEEDED" },
                            { value: "MEDIUM", label: "🟠 MEDIUM PRIORITY" },
                            { value: "COURTESY", label: "⚪ COURTESY REVIEW" },
                            { value: "MESSAGE", label: "💬 MESSAGE ONLY" },
                        ],
                        // 3️⃣ Correctly Reference Registered Component
                        components: {
                            list: Components.PriorityBadge,
                            show: Components.PriorityBadge
                        }
                    },
                    "caseStatus": {
                        label: "📂 Case Status",
                        position: 2,
                        availableValues: [
                            { value: "NEW", label: "✨ New" },
                            { value: "UNDER_REVIEW", label: "👀 Under Review" },
                            { value: "SIGNED", label: "✍️ Signed" },
                            { value: "REJECTED", label: "🚫 Rejected" },
                            { value: "CLOSED", label: "✅ Closed" },
                        ]
                    },
                    "userId": {
                        reference: "User",
                        label: "Client Profile (link)",
                        position: 3
                    },
                    "triageResult.consultation_offered": {
                        label: "🩺 Consultation Offered?",
                        type: 'boolean',
                        position: 4
                    },
                    "triageResult.userAction": {
                        label: "📅 User Booking Status",
                        position: 5,
                        availableValues: [
                            { value: "PENDING", label: "⏳ Pending" },
                            { value: "BOOKED", label: "✅ BOOKED" },
                            { value: "SKIPPED", label: "⏭️ Skipped" },
                        ]
                    },

                    // ------------------------------------
                    // 🚨 DECISION SIGNALS (Icons & Chips)
                    // ------------------------------------
                    "answers.incidentTypes": {
                        label: "🚑 Incident Type",
                        type: "string",
                        isArray: true,
                    },
                    "answers.incidentDateRange": {
                        label: "🕒 When Happened"
                    },
                    "answers.abilityToWork": {
                        label: "Work Capacity",
                        type: "string",
                        isArray: true,
                    },
                    "answers.emotionalSymptoms": {
                        label: "🧠 Emotional State",
                        type: "string",
                        isArray: true,
                    },
                    "answers.hasLawyer": {
                        label: "⚖️ Has Lawyer?",
                        availableValues: [
                            { value: "Yes", label: "⚠️ YES (Courtesy Check)" },
                            { value: "No", label: "No" },
                            { value: "Not sure", label: "Not Sure" }
                        ]
                    },
                    "answers.inTherapy": {
                        label: "🏥 In Therapy?",
                    },

                    // ------------------------------------
                    // 📖 ACCIDENT DETAILS
                    // ------------------------------------
                    "answers.incidentDescription": {
                        type: 'textarea',
                        label: "📝 Full Incident Description"
                    },
                    "answers.hadPersonalInjuryOntario": {
                        type: 'boolean',
                        label: "Ontario Accident?",
                    },

                    // ------------------------------------
                    // 📉 DAILY IMPACT
                    // ------------------------------------
                    "answers.abilityToWorkDetails": {
                        type: 'textarea',
                        label: "Work Impact Details"
                    },
                    "answers.dailyActivitiesAffected": {
                        label: "🏠 Daily Activities Affected",
                        type: "string",
                        isArray: true,
                    },
                    "answers.dailyActivitiesDetails": {
                        type: 'textarea',
                        label: "Daily Activities Details"
                    },

                    // ------------------------------------
                    // 💭 MENTAL STATE & DEMOGRAPHICS
                    // ------------------------------------
                    "answers.feelingsNext": {
                        label: "What the Client Wants Next",
                        type: "string",
                        isArray: true,
                    },
                    "answers.gender": {
                        label: "Gender",
                        isVisible: { show: true, list: false, edit: false, filter: true }
                    },

                    // ------------------------------------
                    // ⚖️ LEGAL CONTEXT
                    // ------------------------------------
                    "answers.lawyerDetails": {
                        type: 'textarea',
                        label: "Lawyer Details"
                    },

                    // ------------------------------------
                    // 🔔 PREFERENCES (Explicitly Nested)
                    // ------------------------------------
                    "answers.notifications.reminders": {
                        type: 'boolean',
                        label: "🔔 Reminders",
                        isVisible: { show: true, list: false, edit: false, filter: false }
                    },
                    "answers.notifications.webinars": {
                        type: 'boolean',
                        label: "📺 Webinars",
                        isVisible: { show: true, list: false, edit: false, filter: false }
                    },
                    "answers.notifications.promotions": {
                        type: 'boolean',
                        label: "🎁 Promotions",
                        isVisible: { show: true, list: false, edit: false, filter: false }
                    },

                    // ------------------------------------
                    // ⚙️ META
                    // ------------------------------------
                    "createdAt": {
                        label: "📅 Submission Date",
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    "updatedAt": {
                        isVisible: { list: false, filter: false, show: true, edit: false }
                    },
                    "_id": {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },

                    // HIDE TECHNICAL FIELDS
                    "triageResult.reason": { isVisible: { list: false, show: false, edit: false } },
                    "triageResult.reasonCodes": { isVisible: { list: false, show: false, edit: false } },
                    "triageResult.ui_to_display": { isVisible: { list: false, show: false, edit: false } },
                    "triageResult.skip_consultation": { isVisible: { list: false, show: false, edit: false } },
                    "triageResult.next_steps": { isVisible: { list: false, show: false, edit: false } },
                    // Hide parent notification object
                    "answers.notifications": { isVisible: { list: false, show: false, edit: false } },
                },
            },
        };

        // --- User Resource Configuration ---
        const UserResource = {
            resource: User,
            options: {
                navigation: {
                    name: "Client Database",
                    icon: "User"
                },
                listProperties: ["email", "firstName", "lastName", "createdAt"],
                properties: {
                    "email": { isTitle: true }
                }
            }
        };

        const admin = new AdminJS({
            resources: [OnboardingResource, UserResource],
            // 4️⃣ Pass ComponentLoader to AdminJS
            componentLoader,
            rootPath: "/admin",
            branding: {
                companyName: "IHP Case Manager",
                softwareBrothers: false,
                logo: false,
                withMadeWithLove: false,
                theme: {
                    colors: {
                        primary100: '#E11D48', // Urgent Red/Rose (High Priority Focus)
                        primary80: '#F43F5E',
                        primary60: '#FB7185',
                        primary40: '#FDA4AF',
                        primary20: '#FFE4E6',
                        accent: '#0EA5E9',     // Calm Blue for secondary actions
                        bg: '#F8FAFC',         // Clinical/Clean background
                    }
                }
            },
        });

        // --- Authentication Strategy ---
        const { ADMIN_EMAIL, ADMIN_PASSWORD, COOKIE_PASSWORD } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !COOKIE_PASSWORD) {
            throw new Error("❌ CRITICAL SECURITY ERROR: ADMIN_EMAIL, ADMIN_PASSWORD, and COOKIE_PASSWORD must be set in .env file. Default credentials have been removed for security.");
        } else {
            console.log(`🔒 AdminJS Authentication Enabled.`);
            console.log(`   Email: '${ADMIN_EMAIL}'`);
        }

        const router = AdminJSExpress.buildAuthenticatedRouter(
            admin,
            {
                authenticate: async (email, password) => {
                    const inputEmail = (email || '').trim();
                    const inputPass = (password || '').trim();
                    const envEmail = ADMIN_EMAIL.trim();
                    const envPass = ADMIN_PASSWORD.trim();

                    if (inputEmail === envEmail && inputPass === envPass) {
                        return { email: inputEmail, role: "admin" };
                    }
                    return null;
                },
                cookieName: "adminjs",
                cookiePassword: COOKIE_PASSWORD,
            },
            null,
            {
                resave: false,
                saveUninitialized: true,
                secret: COOKIE_PASSWORD,
            }
        );

        app.use(admin.options.rootPath, router);

        console.log("✓ AdminJS initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize AdminJS:", error);
    }
};

module.exports = { initAdmin };
