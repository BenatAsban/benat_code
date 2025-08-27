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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);


    useEffect(() => {
        const updateTheme = () => {
            setTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();


    }, []);


    //light-mode End code

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const styles = {
        section: {
            background: theme === "light" ? "#fff" : "#333",
            height: isMobile ? "100vh" : "70vh",
            padding: "64px 0",
        },
        container: {
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
        },

        grid: {
            display: "grid",
            gap: "24px",
            gridTemplateColumns: isMobile ? "repeat(2, 3fr)" : "repeat(3, 2fr)",
            maxWidth: isMobile ? "600px" : undefined,
            margin: isMobile ? "0 auto" : undefined,
            width: isMobile ? "100%" : undefined,
        },
    }

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <motion.div variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible" style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{
                        fontSize: "2rem",
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
                    }}>
                        Discover content that matters to you. Browse through our diverse range of topics.
                    </p>
                </motion.div>

                <div style={styles.grid}>
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            style={{ cursor: "pointer" }}
                        >
                            <div
                                style={{
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    padding: "24px",
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                }}
                            >
                                {/* Gradient overlay */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: theme === "light" ? "#e1d9d1" : "#121212",
                                    transition: "opacity 0.3s ease",
                                }} />

                                <div style={{ position: "relative", zIndex: 0 }}>
                                    {/* Icon with gradient background - Animation container */}
                                    <motion.div
                                        style={{
                                            width: "48px",
                                            height: "48px",
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
                                                    width: "24px",
                                                    height: "24px",
                                                    color: "#ffffff",
                                                }}
                                            />
                                        </div>
                                    </motion.div>

                                    <h3
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: 700,
                                            color: theme === "light" ? "#121212" : "#fff",
                                            marginBottom: "8px",
                                            transition: "all 0.3s ease",
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
            </div>
        </section>
    );
};

export default Categories;