import "./PrivacyPolicy.css";

const OPERATOR = "Desmond";
const CONTACT_EMAIL = "desmondyokai@gmail.com";
const LAST_UPDATED = "November 12th, 2026";

export default function PrivacyPolicy() {
    return (
        <main className="pp-page">
            <article className="pp-article">
                <a className="pp-back" href="/">&larr; Back to Mutabilis</a>
                <h1>Privacy Policy</h1>
                <p className="pp-meta">Last updated: {LAST_UPDATED}</p>

                <section className="pp-section">
                    <h2>Who runs Mutabilis</h2>
                    <p>
                        Mutabilis is a personal project run by {OPERATOR}. Contact:{""}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </p>
                </section>

                <section className="pp-section">
                    <h2>What I collect</h2>
                    <p>
                        Your Google account email, and whatever you add to the app: face photos, diary entries,
                        routines and products, sleep, water and stress logs, and chat messages. Photos, skin scores
                        and diary notes can include health information, so I only process them with your consent.
                    </p>
                </section>

                <section className="pp-section">
                    <h2>How it is used</h2>
                    <p>
                        Only to run the app for you: show your calendar and history, score your photos with AI,
                        and answer your questions about your own data. I do not sell your data or use it for advertising.
                    </p>
                </section>

                <section className="pp-section">
                    <h2>Services that process it</h2>
                    <p>
                        Supabase (sign-in and private photo storage), Amazon Web Services (server and database),
                        Google Gemini (photo scoring), Anthropic Claude (chat replies), and Vercel and Cloudflare
                        (website hosting). Some of these are in the United States, and they are covered by
                        data protection agreements for transfers from the UK.
                    </p>
                </section>

                <section className="pp-section">
                    <h2>How long it is kept</h2>
                    <p>Until you delete it in the app or ask me to delete it.</p>
                </section>

                <section className="pp-section">
                    <h2>Your choices</h2>
                    <p>
                        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to get a copy of your data,
                        correct it, or have your account and all your data deleted. I will handle it within one month.
                        If you are unhappy with how your data is handled, you can complain to the UK Information
                        Commissioner&rsquo;s Office at{" "}
                        <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>.
                    </p>
                </section>

                <section className="pp-section">
                    <h2>Not medical advice</h2>
                    <p>
                        Mutabilis is for tracking and general information only. AI scores and replies can be wrong
                        and are not a diagnosis. See a doctor or dermatologist for any health concern.
                    </p>
                </section>

                <section className="pp-section">
                    <h2>Age</h2>
                    <p>Mutabilis is for people aged 18 and over.</p>
                </section>
            </article>
        </main>
    );
}
