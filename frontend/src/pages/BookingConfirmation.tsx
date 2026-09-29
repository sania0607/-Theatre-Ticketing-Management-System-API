import { useEffect, useState } from "react";
import { cancelBooking, getBookingStatus } from "../services/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function BookingConfirmation() {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const [bookingStatus, setBookingStatus] = useState("PENDING");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!bookingReference || !window.location.hash) return;

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const cancellationToken = fragment.get("cancellationToken");

    if (cancellationToken) {
      sessionStorage.setItem(
        `booking-cancellation:${bookingReference}`,
        cancellationToken
      );
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, [bookingReference]);

  useEffect(() => {
    if (!bookingReference || paymentStatus === "cancelled") return;

    let attempts = 0;
    const checkStatus = async () => {
      try {
        const booking = await getBookingStatus(bookingReference);
        const status = booking.booking_status || "PENDING";
        setBookingStatus(status);
        return status;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    let interval = 0;
    const poll = async () => {
      const status = await checkStatus();

      if (status === "CONFIRMED" || status === "CANCELLED") {
        window.clearInterval(interval);
        return;
      }

      attempts += 1;
      if (attempts >= 30) window.clearInterval(interval);
    };

    void poll();
    interval = window.setInterval(() => void poll(), 2000);

    return () => window.clearInterval(interval);
  }, [bookingReference, paymentStatus]);

  const handleCancelBooking = async () => {
    if (!bookingReference) return;

    setCancelling(true);
    setCancelError("");
    try {
      await cancelBooking(bookingReference);
      setBookingStatus("CANCELLED");
    } catch (error: unknown) {
      setCancelError(
        error instanceof Error ? error.message : "Failed to cancel booking"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <div className="logo">
          MOVIE<span>BOX</span>
        </div>

        <div className="location">
          📍 Meerut
        </div>
      </header>

      <main className="booking-page">

        {paymentStatus === "cancelled" && (
          <>
            <h1>Payment Cancelled</h1>

            <div className="booking-card">
              <p>
                Your payment was cancelled. The seat will be released when
                the temporary lock expires.
              </p>
              <button
                className="book-btn"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        {paymentStatus !== "cancelled" && (
          <>
            <div className="success-icon">
              {paymentStatus === "success" ? "✓" : "..."}
            </div>

            <h1>{bookingStatus === "CONFIRMED" ? "Booking Confirmed" : bookingStatus === "CANCELLED" ? "Booking Cancelled" : bookingStatus === "CANCELLATION_PENDING" ? "Cancellation Processing" : "Payment Received"}</h1>

            <div className="booking-card">
              <p>
                <strong>Booking Reference</strong>
              </p>

              <h2>{bookingReference}</h2>

              <p>
                {bookingStatus === "CONFIRMED"
                  ? "Your payment is complete and your seat is confirmed."
                  : bookingStatus === "CANCELLED"
                  ? "Your booking was cancelled and the payment was refunded."
                  : bookingStatus === "CANCELLATION_PENDING"
                  ? "Your cancellation is being completed. You can retry if it does not finish."
                  : "Stripe has received your payment. Checking booking confirmation..."}
              </p>

              {(bookingStatus === "CONFIRMED" || bookingStatus === "CANCELLATION_PENDING") && bookingReference && sessionStorage.getItem(`booking-cancellation:${bookingReference}`) && (
                <button className="book-btn" onClick={handleCancelBooking} disabled={cancelling}>
                  {cancelling ? "Cancelling..." : bookingStatus === "CANCELLATION_PENDING" ? "Retry Cancellation" : "Cancel Booking"}
                </button>
              )}

              {cancelError && <p className="error-message">{cancelError}</p>}

              <button
                className="book-btn"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>

            </div>
          </>
        )}

      </main>

    </div>
  );
}

export default BookingConfirmation;