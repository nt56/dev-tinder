import {
  FiArrowRight,
  FiCompass,
  FiLink2,
  FiMessageSquare,
} from "react-icons/fi";
import { Link, Navigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

const highlights = [
  {
    title: "Discover relevant developers",
    description:
      "Browse profiles with a simple flow built for fast decisions instead of noisy social clutter.",
    icon: FiCompass,
  },
  {
    title: "Keep track of real matches",
    description:
      "Review accepted connections and incoming requests in one clean workspace.",
    icon: FiLink2,
  },
  {
    title: "Start better conversations",
    description:
      "Use profile context to connect with people who match your goals, stack, and interests.",
    icon: FiMessageSquare,
  },
];

const Home = () => {
  const user = useSelector((store) => store.user);
  const { isAuthResolved } = useOutletContext();

  if (!isAuthResolved) {
    return (
      <section className="app-shell app-fade-up px-1">
        <div className="page-hero flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-10 text-center sm:px-10">
          <div>
            <p className="hero-kicker mx-auto">Loading</p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--app-text)]">
              Preparing your DevTinder home page
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              We are checking whether you already have an active session.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <section className="app-shell app-fade-up space-y-6 px-1">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="page-hero px-6 py-8 sm:px-8 sm:py-10">
          <p className="hero-kicker">Developer-first landing page</p>
          <h1 className="hero-title mt-5 max-w-3xl">
            Meet developers, build meaningful connections, and keep the process
            simple.
          </h1>
          <p className="hero-copy mt-5">
            DevTinder gives you a clean way to discover people in tech, send
            connection requests, and manage your network without the usual noise
            of a crowded social app.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="app-button-primary">
              Get started
              <FiArrowRight size={16} />
            </Link>
            <Link to="/forgot-password" className="app-button-secondary">
              Reset password
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="showcase-stat">
              <p className="text-2xl font-semibold text-[var(--app-text)]">1</p>
              <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                Create your account and complete your profile in minutes.
              </p>
            </div>
            <div className="showcase-stat">
              <p className="text-2xl font-semibold text-[var(--app-text)]">2</p>
              <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                Explore developer profiles and send interest when someone stands
                out.
              </p>
            </div>
            <div className="showcase-stat">
              <p className="text-2xl font-semibold text-[var(--app-text)]">3</p>
              <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                Accept requests, manage connections, and keep your network
                organized.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card flex flex-col justify-between gap-5 px-6 py-6 sm:px-7 sm:py-7">
          <div>
            <p className="hero-kicker">Why DevTinder</p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--app-text)]">
              A lightweight home for developer networking
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
              The product is focused on profile discovery, request review, and
              real connection tracking.
            </p>
          </div>

          <div className="grid gap-3">
            {highlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="surface-card-soft flex gap-4 px-4 py-4"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--app-text)]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
