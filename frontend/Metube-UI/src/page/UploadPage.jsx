import React, { useEffect } from "react";
import UploadWizard from "../components/UploadForm";
import { useAuth } from "../context/AuthContext";
import { notifyError } from "../helper/popUp.js";
import { Toaster } from "react-hot-toast";
import { LockKeyhole } from "lucide-react";

const UploadPage = ({ isClose }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      notifyError("Bạn cần đăng nhập để sử dụng tính năng tải lên video!");
    }
  }, [user, loading]);

  // FIX: thêm fallback safety (tránh render sai khi state chưa sync cookie)
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-white"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <Toaster position="top-right" reverseOrder={false} />

        <div
          className="card bg-dark text-white shadow-lg text-center py-5 border-none"
          style={{
            minHeight: "450px",
            maxWidth: "600px",
            borderRadius: "20px",
            width: "100%",
          }}
        >
          <div className="card-body d-flex flex-column justify-content-center align-items-center gap-4 p-4">
            <div className="p-4 bg-danger bg-opacity-10 rounded-circle text-danger mb-2">
              <LockKeyhole size={48} />
            </div>

            <div>
              <h3 className="fw-bold mb-3">Tính năng giới hạn</h3>
              <p className="text-secondary px-3">
                Bạn cần đăng nhập trước khi tải video lên hệ thống.
              </p>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button
                type="button"
                className="btn btn-outline-warning px-4 py-2"
                onClick={isClose}
              >
                Quay lại
              </button>

              <button
                type="button"
                className="btn btn-danger px-4 py-2 fw-bold"
                onClick={() => (window.location.href = "/login")}
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0 p-4">
      <UploadWizard closeUploadPage={isClose} />
    </div>
  );
};

export default UploadPage;
