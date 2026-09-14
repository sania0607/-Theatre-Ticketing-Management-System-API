import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shows from "./pages/Shows";
import Seats from "./pages/Seats";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shows/:movieId"
          element={<Shows />}
        />

        <Route
          path="/seats/:showId"
          element={<Seats />}
        />

        <Route
          path="/booking/:bookingReference"
          element={<BookingConfirmation />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

