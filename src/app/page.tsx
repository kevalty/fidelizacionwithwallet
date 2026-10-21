import Link from "next/link";

export default function Home() {
  return (
    <div style={{ backgroundColor: "var(--cream)", color: "var(--ink)" }}>
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          backgroundColor: "rgba(250,250,247,0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            className="font-display"
            style={{ fontSize: 24, fontWeight: 700, fontStyle: "italic", color: "var(--ink)" }}
          >
            Fideliza
          </span>
          <Link
            href="/login"
            style={{
              backgroundColor: "var(--gold)",
              color: "white",
              padding: "10px 24px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          backgroundColor: "var(--ink)",
          color: "white",
          padding: "100px 24px 80px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, rgba(200,150,62,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-grid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: Text */}
          <div>
            <div
              className="animate-fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(200,150,62,0.15)",
                border: "1px solid rgba(200,150,62,0.3)",
                borderRadius: 999,
                padding: "6px 14px",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--gold)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 500 }}>
                Lanzando en Riobamba, Ecuador
              </span>
            </div>

            <h1
              className="font-display animate-fade-up animate-delay-1"
              style={{
                fontSize: "clamp(44px, 6vw, 72px)",
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: 24,
                color: "white",
              }}
            >
              Fideliza clientes
              <br />
              <span style={{ color: "var(--gold)" }}>sin apps,</span>
              <br />
              sin complicaciones.
            </h1>

            <p
              className="animate-fade-up animate-delay-2"
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.65)",
                marginBottom: 40,
                maxWidth: 480,
              }}
            >
              Tus clientes guardan una tarjeta de sellos en su celular — Apple Wallet o Google
              Wallet. Cada visita suma. Con X sellos, ganan su premio.
            </p>

            <div
              className="animate-fade-up animate-delay-3"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link
                href="/login"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Empezar ahora
              </Link>
              <a
                href="#como-funciona"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Ver cómo funciona
              </a>
            </div>

            <div
              className="animate-fade-up animate-delay-4"
              style={{ display: "flex", gap: 32, marginTop: 48 }}
            >
              {[
                { n: "0 apps", l: "el cliente descarga" },
                { n: "10 seg", l: "para registrarse" },
                { n: "$17/mes", l: "para empezar" },
              ].map(({ n, l }) => (
                <div key={n}>
                  <div
                    className="font-display"
                    style={{ fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "white" }}
                  >
                    {n}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div
            className="hero-phone"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              className="animate-float"
              style={{
                width: 280,
                height: 560,
                border: "2px solid rgba(255,255,255,0.15)",
                borderRadius: 44,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                padding: 16,
                position: "relative",
                boxShadow: "0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Notch */}
              <div
                style={{
                  width: 80,
                  height: 6,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 999,
                  margin: "0 auto 20px",
                }}
              />

              {/* Wallet pass card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1a3a2e 0%, #0d2018 100%)",
                  borderRadius: 20,
                  padding: 20,
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(200,150,62,0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>
                      TARJETA DE SELLOS
                    </div>
                    <div
                      className="font-display"
                      style={{ fontSize: 18, fontWeight: 700, fontStyle: "italic", color: "white" }}
                    >
                      Café del Centro
                    </div>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--gold)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    ☕
                  </div>
                </div>

                {/* Stamps grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: i < 7 ? "var(--gold)" : "rgba(255,255,255,0.1)",
                        border:
                          i < 7 ? "none" : "1.5px dashed rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: i < 7 ? 16 : 0,
                        color: "white",
                      }}
                    >
                      {i < 7 ? "✓" : ""}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  7 de 10 sellos •{" "}
                  <span style={{ color: "var(--gold)" }}>¡Falta poco!</span>
                </div>
              </div>

              {/* Activity items */}
              <div style={{ padding: "16px 4px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#4ade80",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                    Sello acreditado — hace 2 horas
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "var(--gold)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                    Café visitado 3 veces esta semana
                  </span>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div
              className="animate-float-slow"
              style={{
                position: "absolute",
                right: -20,
                bottom: 80,
                width: 160,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 12,
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                HOY
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "white",
                }}
              >
                +12
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                sellos acreditados
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WALLET BADGES ── */}
      <section style={{ borderBottom: "1px solid var(--border)", padding: "28px 24px" }}>
        <div
          className="wallet-row"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🍎", text: "Funciona en Apple Wallet" },
            { icon: "🤖", text: "Funciona en Google Wallet" },
            { icon: "🇪🇨", text: "Hecho para Ecuador" },
            { icon: "💬", text: "Soporte por WhatsApp" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--gold)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Cómo funciona
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(36px, 5vw, 52px)",
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Simple para el cliente,
              <br />
              poderoso para ti.
            </h2>
          </div>

          <div
            className="how-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}
          >
            {[
              {
                step: "01",
                title: "El cliente se registra",
                desc: "Escanea un QR en tu local con el celular. Sin descargar nada, en menos de 10 segundos.",
                icon: "📱",
              },
              {
                step: "02",
                title: "Gana sellos",
                desc: "En cada visita, el staff escanea su tarjeta o toca el NFC del mostrador. Un sello por visita.",
                icon: "✦",
              },
              {
                step: "03",
                title: "Canjea su premio",
                desc: "Al completar los sellos, el cliente gana su recompensa. Tú defines cuántos y qué dan.",
                icon: "🎁",
              },
            ].map(({ step, title, desc, icon }) => (
              <div
                key={step}
                style={{
                  padding: 32,
                  backgroundColor: "white",
                  borderRadius: 24,
                  border: "1px solid var(--border)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 24,
                    fontSize: 40,
                    opacity: 0.08,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                  }}
                >
                  {step}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: "var(--gold-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    marginBottom: 20,
                  }}
                >
                  {icon}
                </div>
                <h3
                  className="font-display"
                  style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", marginBottom: 12 }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{ backgroundColor: "var(--ink)", color: "white", padding: "100px 24px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--gold)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Panel de control
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(36px, 4vw, 48px)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                Todo bajo tu control,
                <br />
                sin depender de nadie.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 40,
                }}
              >
                Desde tu panel ves cuántos clientes tienes, cuántos vuelven, cuántos premios se
                canjearon. Exporta tu base de datos cuando quieras — los datos son tuyos.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Clientes registrados y su historial",
                  "Exportación CSV en un clic",
                  "Configuración del programa de sellos",
                  "Agrega locales y staff fácilmente",
                ].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "rgba(200,150,62,0.2)",
                        border: "1px solid var(--gold)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "var(--gold)" }}>✓</span>
                    </div>
                    <span style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 24,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}
              >
                {[
                  { label: "Clientes", value: "248", delta: "+12 esta semana" },
                  { label: "Sellos hoy", value: "34", delta: "+8 vs ayer" },
                  { label: "Canjes", value: "19", delta: "este mes" },
                  { label: "Retorno", value: "68%", delta: "de clientes" },
                ].map(({ label, value, delta }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}
                    >
                      {label}
                    </div>
                    <div
                      className="font-display"
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 4 }}>{delta}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}
                >
                  Clientes recientes
                </div>
                {[
                  { name: "María G.", stamps: 8, time: "hace 5 min" },
                  { name: "Carlos P.", stamps: 3, time: "hace 12 min" },
                  { name: "Andrea M.", stamps: 10, time: "hace 1h — canjeó" },
                ].map(({ name, stamps, time }) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: "rgba(200,150,62,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "var(--gold)",
                          fontWeight: 600,
                        }}
                      >
                        {name[0]}
                      </div>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{name}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "var(--gold)" }}>{stamps} sellos</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--gold)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Precios
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Sin sorpresas.
            <br />
            Sin contrato.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--muted)",
              maxWidth: 480,
              margin: "0 auto 60px",
            }}
          >
            Empieza con los primeros pilotos a precio especial. Los datos de tus clientes siempre
            son tuyos y puedes exportarlos cuando quieras.
          </p>

          <div
            className="pricing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {[
              {
                name: "Básico",
                price: "$17",
                per: "/mes",
                features: ["1 local", "Sellos ilimitados", "Panel simple", "Exportar CSV"],
                highlight: false,
              },
              {
                name: "Pro",
                price: "$35",
                per: "/mes",
                features: [
                  "Hasta 3 locales",
                  "Todo lo del básico",
                  "Estadísticas avanzadas",
                  "Soporte prioritario",
                ],
                highlight: true,
              },
            ].map(({ name, price, per, features, highlight }) => (
              <div
                key={name}
                style={{
                  padding: 32,
                  borderRadius: 24,
                  border: highlight ? "2px solid var(--gold)" : "1px solid var(--border)",
                  backgroundColor: highlight ? "var(--ink)" : "white",
                  color: highlight ? "white" : "var(--ink)",
                  position: "relative",
                }}
              >
                {highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "var(--gold)",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    MÁS POPULAR
                  </div>
                )}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 16,
                    opacity: highlight ? 0.7 : 0.6,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}
                >
                  <span
                    className="font-display"
                    style={{ fontSize: 48, fontWeight: 700, fontStyle: "italic" }}
                  >
                    {price}
                  </span>
                  <span style={{ fontSize: 14, opacity: 0.6 }}>{per}</span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}
                >
                  {features.map((f) => (
                    <div
                      key={f}
                      style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, opacity: 0.8 }}
                    >
                      <span style={{ color: "var(--gold)" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 24px",
                    borderRadius: 999,
                    backgroundColor: highlight ? "var(--gold)" : "transparent",
                    border: highlight ? "none" : "1px solid var(--border)",
                    color: highlight ? "white" : "var(--ink)",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  Empezar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        style={{
          backgroundColor: "var(--gold-light)",
          padding: "80px 24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontStyle: "italic",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            ¿Listo para tener clientes
            <br />
            que vuelven?
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 36 }}>
            3 pilotos de 30 días disponibles en Riobamba. Sin contrato de permanencia.
          </p>
          <Link
            href="/login"
            style={{
              backgroundColor: "var(--ink)",
              color: "white",
              padding: "16px 40px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Hablar por WhatsApp →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            className="font-display"
            style={{ fontSize: 20, fontWeight: 700, fontStyle: "italic" }}
          >
            Fideliza
          </span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>© 2026 · Riobamba, Ecuador</span>
          <Link href="/login" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            Iniciar sesión
          </Link>
        </div>
      </footer>
    </div>
  );
}
