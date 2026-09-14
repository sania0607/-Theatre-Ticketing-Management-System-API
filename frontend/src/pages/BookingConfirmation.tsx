import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confirmBooking } from "../services/api";
import "../App.css";

function BookingConfirmation() {
  const { bookingReference } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  const handleConfirmBooking = async () => {
    if (!bookingReference) return;

    try {
      setLoading(true);
      setError("");

      const data = await confirmBooking(bookingReference);

      setBooking(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
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

        {!booking && (
          <>
            <h1>Confirm Your Booking</h1>

            <div className="booking-card">

              <p>
                <strong>Booking Reference:</strong>
              </p>

              <h2>{bookingReference}</h2>

              <p>
                Your seat has been temporarily locked.
              </p>

              <button
                className="book-btn"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading
                  ? "Confirming..."
                  : "Confirm Booking"}
              </button>

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

            </div>
          </>
        )}

        {booking && (
          <>
            <div className="success-icon">
              ✓
            </div>

            <h1>Booking Confirmed!</h1>

            <div className="booking-card">

              <p>
                <strong>Booking Reference</strong>
              </p>

              <h2>{booking.booking.booking_reference}</h2>

              <p>
                <strong>Status:</strong>{" "}
                {booking.booking.booking_status}
              </p>

              <p>
                <strong>Aggregator:</strong>{" "}
                {booking.booking.aggregator_name}
              </p>

              <p>
                <strong>Total Amount:</strong>{" "}
                ₹{booking.booking.total_amount}
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

      </main>

    </div>
  );
}

export default BookingConfirmation;