/**
 * SPEEDWORLD PRO - LOGIC ENGINE
 * Handles: Tab Navigation, Renewal Blocking, and Troubleshooting Flow
 */

// 1. DATABASE CONFIGURATION (Replace with your actual keys)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const _supabase = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// 2. APP STATE (Global variables)
const CURRENT_USER_ID = 'SW-1052';
let userData = {
    full_name: "Rajesh Kumar",
    user_id: "SW-1052",
    current_plan: "500 Mbps Business",
    plan_expiry: 14,
    current_balance: 599, // Change to 0 to test "Unblocked" renewal
    member_since: "Jan 2024"
};

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Speedworld App Initialized");
    loadUserData();
    switchTab('home-view'); // Default view
});

/**
 * FEATURE: LOAD USER DATA (XXXIV)
 */
async function loadUserData() {
    // If Supabase is connected, fetch real data
    if (_supabase) {
        const { data, error } = await _supabase
            .from('customers')
            .select('*')
            .eq('user_id', CURRENT_USER_ID)
            .single();
        if (data) userData = data;
    }

    // Render data to the UI
    document.getElementById('display-name').innerText = userData.full_name;
    document.getElementById('display-id').innerText = userData.user_id;
    document.getElementById('display-plan').innerText = userData.current_plan;
    document.getElementById('display-expiry').innerText = userData.plan_expiry + " Days Left";
    
    // Logic for Dues (XXX)
    const duesBar = document.getElementById('dues-bar');
    if (userData.current_balance > 0) {
        duesBar.classList.remove('hidden');
        document.getElementById('display-dues').innerText = "₹" + userData.current_balance;
    } else {
        duesBar.classList.add('hidden');
    }
}

/**
 * FEATURE: TAB NAVIGATION (XXXVI)
 */
function switchTab(viewId, element) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');

    // Update Bottom Nav active state
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * FEATURE: RENEWAL BLOCKING (XXX, XXXII)
 */
function handleRenew() {
    if (userData.current_balance > 0) {
        // Direct to Dues Payment [XXXII]
        alert("RENEWAL BLOCKED: You have an outstanding balance of ₹" + userData.current_balance + ". Please clear your dues to continue.");
        switchTab('billing-view');
    } else {
        // Proceed to Renewal Section [XXXVII]
        switchTab('plans-view');
        alert("Opening Plan Selection...");
    }
}

/**
 * FEATURE: TROUBLESHOOTING QUESTIONNAIRE (XL)
 */
function showTroubleshoot() {
    const category = document.getElementById('issue-category').value;
    const tsArea = document.getElementById('ts-area');
    
    if (!category) {
        tsArea.classList.add('hidden');
        return;
    }

    tsArea.classList.remove('hidden');
    
    if (category === 'no-internet') {
        tsArea.innerHTML = `
            <div class="ts-card">
                <p><strong>Step 1:</strong> Is your router's <strong>LOS</strong> light blinking Red?</p>
                <div class="ts-btns">
                    <button onclick="tsResponse('line-issue')">Yes, it's Red</button>
                    <button onclick="tsResponse('restart-guide')">No
