// Layout.jsx
import Navbar from "@/app/ui/dashboard/navbar/navbar";
import Sidebar from "@/app/ui/dashboard/sidebar/sidebar";
import Footer from "@/app/ui/dashboard/footer/footer";
import styles from "@/app/dashboard/archive/layout.module.css"; // استایل لایه‌بندی

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.main}>
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
