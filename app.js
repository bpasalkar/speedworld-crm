// 1. CONFIGURATION
const SUPABASE_URL = 'https://xornzelybefhpcpfrmhl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UZD-UWg94FObGgah7XbyUA_64-1uj9M';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const CURRENT_USER = 'SW-1052'; // Rajesh Kumar

const api = {
    async loadAll() {
        console.log("App Initializing...");
        try {
            const { data: user, error } = await _supabase.from('customers').select('*').eq('user_id', CURRENT_USER).single();
            if (error) throw error;
            if (user) this.renderUI(user);
            
            // Run these separately so one failure doesn't stop the other
            this.fetchTickets();
            this.fetchPayments();
        } catch (err) {
            console.error("User Load Error:", err);
        }
    },

    renderUI(user) {
        document.getElementById('user-welcome').innerText = "Hello, " + user.full_name;
        document.getElementById('plan-name').innerText = user.current_plan;
        document.getElementById('balance-display').innerText = "₹" + user.current_balance;
        document.getElementById('expiry-date').innerText = "Expires: " + user.plan_expiry;
        
        const payBtn = document.getElementById('pay-btn');
        if(user.current_balance > 0) payBtn.classList.remove('hidden');
    },

    async fetchTickets() {
        console.log("Fetching Tickets...");
        const { data, error } = await _supabase.from('tickets').select('*').eq('customer_id', CURRENT_USER).order('id', {ascending: false});
        
        const listContainer = document.getElementById('ticket-list');
        if (error) {
            console.error("Ticket Fetch Error:", error);
            return;
        }

        if (data && data.length > 0) {
            listContainer.innerHTML = data.map(t => `
                <div class="item-row">
                    <span><strong>${t.ticket_number}</strong><br><small>${t.category}</small></span>
                    <span class="badge ${t.ticket_status.toLowerCase().replace(/\s/g, '')}">${t.ticket_status}</span>
                </div>
            `).join('');
        } else {
            listContainer.innerHTML = '<p class="sub-text">No active tickets found.</p>';
        }
    },

    async fetchPayments() {
        console.log("Fetching Payments...");
        const { data, error } = await _supabase.from('payments').select('*').eq('customer_id', CURRENT_USER);
        
        const payContainer = document.getElementById('payment-list');
        if (error) {
            console.error("Payment Fetch Error:", error);
            return;
        }

        if (data && data.length > 0) {
            payContainer.innerHTML = data.map(p => `
                <div class="item-row">
                    <span><strong>₹${p.amount_paid}</strong><br><small>${p.payment_date}</small></span>
                    <a href="${p.invoice_link}" target="_blank" style="color:var(--teal);"><i class="fas fa-file-invoice"></i></a>
                </div>
            `).join('');
        } else {
            payContainer.innerHTML = '<p class="sub-text">No payment history found.</p>';
        }
    }
};

// Make accessible to HTML onclicks
window.api = api;
window.toggleDrawer = (id) => document.getElementById(id).classList.toggle('hidden');

// Boot
document.addEventListener('DOMContentLoaded', () => api.loadAll());
