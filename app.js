// CONFIGURATION
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const USER_ID = 'SW-1052'; 

const api = {
    user: null,

    async init() {
        // Fetch User Data [II, V, XXIX]
        const { data, error } = await _supabase.from('customers').select('*').eq('user_id', USER_ID).single();
        if (data) {
            this.user = data;
            this.renderHome();
        }
    },

    renderHome() {
        document.getElementById('display-name').innerText = this.user.full_name;
        document.getElementById('display-plan').innerText = this.user.current_plan;
        document.getElementById('display-expiry').innerText = this.user.plan_expiry + " Days Left";
        
        // Handle Dues Logic [XXX, XXXII]
        const duesBox = document.getElementById('dues-warning');
        if (this.user.current_balance > 0) {
            duesBox.classList.remove('hidden');
            document.getElementById('display-dues').innerText = "₹" + this.user.current_balance;
            document.getElementById('bill-amount').innerText = "₹" + this.user.current_balance;
        } else {
            duesBox.classList.add('hidden');
        }
    }
};

// TAB SWITCHER
function switchTab(viewId, el) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if(el) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
    }
}

// RENEWAL LOGIC [XXXII]
function handleRenewalClick() {
    if (api.user.current_balance > 0) {
        alert("Action Required: Please clear your outstanding dues (₹" + api.user.current_balance + ") before renewing your plan.");
        switchTab('account-view'); // Redirect to Billing
    } else {
        switchTab('plans-view'); // Proceed to Change Plan
    }
}

// TROUBLESHOOTING LOGIC [XL]
function runTroubleshoot() {
    const cat = document.getElementById('complaint-category').value;
    const tsArea = document.getElementById('troubleshoot-area');
    
    if (cat === "No Internet") {
        tsArea.innerHTML = `
            <div class="ts-box">
                <p><strong>Quick Check:</strong> Is the 'LOS' light on your router blinking Red?</p>
                <button onclick="alert('Checking line...')">Yes</button>
                <button onclick="alert('Restart your router and wait 2 mins.')">No</button>
            </div>`;
        tsArea.classList.remove('hidden');
    } else {
        tsArea.classList.add('hidden');
    }
}

// Start
api.init();
