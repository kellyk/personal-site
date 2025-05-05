export default function WorkExperience() {
  const roles = [
    {
      title: "Staff Software Engineer",
      company: "Tumblr",
      dates: "March 2023 – April 2025",
      accomplishments: [
        'Launched Tumblr Premium on tumblr.com, bundling perks like store credits and ad-free browsing — giving the subscription model a double-digit ARR glow-up.',
        'Shipped a multi-column layout for Tumblr power users (Hack Week winner 🏆).',
        'Turned down the volume on noisy notifications — slashing 2 million a day without hurting conversions.',
        'Built moderation tools for Communities to help admins keep their spaces kind, safe, and spam-free.'
      ]
    },
    {
      title: "L4 → Senior → Staff Software Engineer",
      company: "Twitter",
      dates: "June 2014 - January 2023",
      accomplishments: [
        'Spearheaded GraphQL adoption across twitter.com, scaling it from idea to mission-critical infrastructure.',
        'Brought Twitter Blue into the web3 world with NFT avatars',
        'Advocated for accessibility, from employee training to launch reviews.',
        'Contributed to iconic features like Quote Tweet, Ranked timeline, and the new Twitter.com.',
        'Mentored and onboarded over a dozen engineers and built curriculum for GraphQL, React Hooks, and A11y workshops.'
      ]
    },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-indigo-700 uppercase tracking-wide mb-8">Work Experience</h2>
      <div className="space-y-12">
        {roles.map((role, index) => (
          <div key={index} className="md:grid md:grid-cols-9 md:gap-8">
            {/* Left column */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold">{role.title}</h3>
              <p className="text-indigo-700 font-bold">{role.company}</p>
              <p className="italic text-black-700 mt-1">{role.dates}</p>
            </div>
            {/* Right column */}
            <div className="col-span-6 mt-4 md:mt-0 leading-relaxed">
              <ul className="list-disc pl-5">
                {role.accomplishments && role.accomplishments.map((accomplishment, index) => (
                  <li key={index} className="mb-2">{accomplishment}</li>
                ))}
                </ul>
            </div>
          </div>
        ))}
      </div>
        <p><a href="/Kelly-King-Resume.pdf" target="_blank" className="font-medium text-indigo-700 dark:text-indigo-500 hover:underline">Download full resume (PDF)</a></p>
    </section>
  );
}
