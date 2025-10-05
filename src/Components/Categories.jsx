import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { NotepadText, Brain, Globe, Cross, Landmark, Coffee } from 'lucide-react';

const categories = [
    {
        id: 1,
        name: "All Posts",
        icon: NotepadText,
        gradient: "linear-gradient(to right, #3b82f6, #22d3ee)",
        overlay: "rgba(59, 130, 246, 0.1)",
    },
    {
        id: 2,
        name: "Information",
        icon: Brain,
        gradient: "linear-gradient(to right, #a855f7, #ec4899)",
        overlay: "rgba(168, 85, 247, 0.1)",
    },
    {
        id: 3,
        name: "Gadget",
        icon: Globe,
        gradient: "linear-gradient(to right, #f59e0b, #f97316)",
        overlay: "rgba(16, 185, 129, 0.1)",
    },
    {
        id: 4,
        name: "Health",
        icon: Cross,
        gradient: "linear-gradient(to right, #10b981, #2a2c2bff)",
        overlay: "rgba(245, 158, 11, 0.1)",
    },
    {
        id: 5,
        name: "Wealth",
        icon: Landmark,
        gradient: "linear-gradient(to right, #ef4444, #fb7185)",
        overlay: "rgba(239, 68, 68, 0.1)",
    },
    {
        id: 6,
        name: "Uncategorized",
        icon: Coffee,
        gradient: "linear-gradient(to right, #6366f1, #a78bfa)",
        overlay: "rgba(99, 102, 241, 0.1)",
    },
];

const Categories = () => {
    const [theme, setTheme] = useState("light");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if window is defined (for SSR safety)
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 600);

            const updateTheme = () => {
                setTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");
            };

            updateTheme();

            const observer = new MutationObserver(updateTheme);
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ["class"],
            });

            const handleResize = () => {
                setIsMobile(window.innerWidth <= 600);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                observer.disconnect();
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    const styles = {
        section: {
            background: theme === "light" ? "#fff" : "#333",
            padding: "64px 0",
            minHeight: "auto",
            width: "100%",
            overflow: "hidden",
        },
        container: {
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 16px", // Reduced padding for mobile
            width: "100%",
            boxSizing: "border-box",
        },
        grid: {
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(3, 2fr)",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
        },
    };

    // Mobile-specific styles
    const mobileStyles = {
        section: {
            ...styles.section,
            padding: "48px 0",
        },
        container: {
            ...styles.container,
            padding: "0 12px",
        },
        grid: {
            ...styles.grid,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
        },
    };

    const currentStyles = isMobile ? mobileStyles : styles;

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <section style={currentStyles.section}>
            <div style={currentStyles.container}>
                <motion.div
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    style={{
                        textAlign: "center",
                        marginBottom: isMobile ? "32px" : "48px",
                        width: "100%"
                    }}
                >
                    <h2 style={{
                        fontSize: isMobile ? "1.5rem" : "2rem",
                        fontWeight: 700,
                        marginBottom: "16px",
                        color: theme === "light" ? "#121212" : "#fff",
                        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}>
                        Explore Categories
                    </h2>
                    <p style={{
                        color: theme === "light" ? "#121212" : "#fff",
                        maxWidth: "42rem",
                        margin: "0 auto",
                        lineHeight: 1.5,
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        padding: isMobile ? "0 16px" : "0",
                    }}>
                        Discover content that matters to you. Browse through our diverse range of topics.
                    </p>
                </motion.div>

                <div style={currentStyles.grid}>
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            style={{
                                cursor: "pointer",
                                minHeight: "140px"
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    padding: isMobile ? "16px" : "24px",
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: theme === "light" ? "#e1d9d1" : "#121212",
                                    transition: "opacity 0.3s ease",
                                }} />

                                <div style={{
                                    position: "relative",
                                    zIndex: 0,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <motion.div
                                        style={{
                                            width: isMobile ? "40px" : "48px",
                                            height: isMobile ? "40px" : "48px",
                                            borderRadius: "8px",
                                            background: category.gradient,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "16px",
                                        }}
                                        whileHover={{
                                            rotate: 360,
                                            scale: 1.05,
                                            transition: {
                                                rotate: { duration: 0.6, ease: "easeInOut" },
                                                scale: { duration: 0.2 }
                                            }
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "100%",
                                        }}>
                                            <category.icon
                                                style={{
                                                    width: isMobile ? "20px" : "24px",
                                                    height: isMobile ? "20px" : "24px",
                                                    color: "#ffffff",
                                                }}
                                            />
                                        </div>
                                    </motion.div>

                                    <h3
                                        style={{
                                            fontSize: isMobile ? "1rem" : "1.25rem",
                                            fontWeight: 700,
                                            color: theme === "light" ? "#121212" : "#fff",
                                            marginBottom: "8px",
                                            transition: "all 0.3s ease",
                                            textAlign: isMobile ? "center" : "left",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundImage = category.gradient;
                                            e.target.style.backgroundClip = "text";
                                            e.target.style.webkitBackgroundClip = "text";
                                            e.target.style.color = "transparent";
                                            e.target.style.webkitTextFillColor = "transparent";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundImage = "none";
                                            e.target.style.backgroundClip = "initial";
                                            e.target.style.webkitBackgroundClip = "initial";
                                            e.target.style.color = theme === "light" ? "#121212" : "#fff";
                                            e.target.style.webkitTextFillColor = theme === "light" ? "#121212" : "#fff";
                                        }}
                                    >
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Enhanced CSS for better mobile support */}
                <style jsx>{`
                    @media screen and (max-width: 768px) {
                        #grid {
                            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
                            gap: 12px !important;
                        }
                    }
                    
                    @media screen and (max-width: 480px) {
                        #grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                            gap: 10px !important;
                        }
                    }
                    
                    @media screen and (max-width: 320px) {
                        #grid {
                            grid-template-columns: repeat(2, minmax(135px, 1fr)) !important;
                            gap: 8px !important;
                        }
                        
                        #font {
                            text-align: center;
                            font-size: 0.9rem !important;
                        }
                        
                        #icon {
                            margin: 0 auto 12px auto !important;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default Categories;