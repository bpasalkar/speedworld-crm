const SUPABASE_URL = 'https://xornzelybefhpcpfrmhl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UZD-UWg94FObGgah7XbyUA_64-1uj9M';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const USER_ID = 'SW-1052'; 

const api = {
    // 1. Switch Tabs (The "App" feel)
    switchTab(tabId, element) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        element.classList.add('active');

        if(tabId === 'account-tab') this.loadDashboard();
    },

    // 2. Load User Dashboard Data
    async loadDashboard() {
        const { data: user } = await _supabase.from('customers').select('*').eq('user_id', USER_ID).single();
        if (user) {
            document.getElementById('plan-name').innerText = user.current_plan;
            document.getElementById('balance-display').innerText = "₹" + user.current_balance;
            document.getElementById('expiry-date').innerText = "Valid Till: " + user.plan_expiry;
            if(user.current_balance > 0) document.getElementById('pay-btn').classList.remove('hidden');
        }
    },

    // 3. New Connection Inquiry (Business Requirement)
    async submitInquiry() {
        const name = document.getElementById('inq-name').value;
        const phone = document.getElementById('inq-phone').value;
        const area = document.getElementById('inq-area').value;

        if(!name || !phone) return alert("Please fill Name and Phone.");

        const { error } = await _supabase.from('inquiries').insert([{
            full_name: name, mobile: phone, area: area, status: 'New Lead'
        }]);

        if (!error) {
            alert("Inquiry Sent! Our team will contact you shortly.");
            document.getElementById('inq-name').value = '';
            document.getElementById('inq-phone').value = '';
        }
    }
};

// Global Helpers
window.switchTab = api.switchTab.bind(api);
window.api = api;

// Boot
document.addEventListener('DOMContentLoaded', () => {
    // Start on Home Tab
});
