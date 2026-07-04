import { useMemo } from 'react';
import { formatPrice } from '../../utils/constants';

const SEAT_ROWS = 20;
const EXTRA_LEGROOM_ROWS = [1, 12, 13];
const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Hardcoded mock occupied seats based on flight id or static for now
const getOccupiedSeats = () => {
  return ['1A', '2B', '2C', '5F', '12A', '12B', '15C', '18E', '19F'];
};

const SeatMap = ({ passengers, selectedSeats, onSeatSelect }) => {
  const occupiedSeats = useMemo(() => getOccupiedSeats(), []);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      onSeatSelect(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= passengers) {
        return; // Max reached
      }
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  const getSeatStyle = (seatId, isExtraLegroom) => {
    if (occupiedSeats.includes(seatId)) return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    if (selectedSeats.includes(seatId)) return 'bg-primary-600 text-white shadow-md border border-primary-700';
    if (isExtraLegroom) return 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-sm';
    return 'bg-white border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 cursor-pointer';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2 w-full text-left">Seat Map (Airbus A320)</h3>
      <p className="text-sm text-gray-500 w-full text-left mb-6">Select up to {passengers} seat(s).</p>
      
      <div className="flex gap-4 mb-8 text-sm flex-wrap justify-center">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-300 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-primary-600 rounded"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded"></div> Occupied</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div> Extra Legroom ({formatPrice(400, 'INR', 'INR')})</div>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 max-w-sm w-full">
        <div className="flex justify-between mb-4 px-2 font-semibold text-gray-500">
          <div className="flex gap-2">
            <div className="w-8 text-center">A</div>
            <div className="w-8 text-center">B</div>
            <div className="w-8 text-center">C</div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 text-center">D</div>
            <div className="w-8 text-center">E</div>
            <div className="w-8 text-center">F</div>
          </div>
        </div>

        <div className="space-y-3 relative">
          <div className="absolute left-1/2 -top-2 bottom-0 w-8 -translate-x-1/2 bg-gray-200/50 rounded-full" />
          
          {Array.from({ length: SEAT_ROWS }).map((_, rowIdx) => {
            const row = rowIdx + 1;
            const isExtraLegroom = EXTRA_LEGROOM_ROWS.includes(row);
            
            return (
              <div key={row} className="flex justify-between items-center relative z-10">
                <div className="flex gap-2">
                  {SEAT_LETTERS.slice(0, 3).map(letter => {
                    const seatId = `${row}${letter}`;
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={occupiedSeats.includes(seatId)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getSeatStyle(seatId, isExtraLegroom)}`}
                      >
                        {selectedSeats.includes(seatId) ? row : ''}
                      </button>
                    )
                  })}
                </div>
                
                <div className="w-8 text-center text-xs font-bold text-gray-400">
                  {row}
                </div>
                
                <div className="flex gap-2">
                  {SEAT_LETTERS.slice(3, 6).map(letter => {
                    const seatId = `${row}${letter}`;
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={occupiedSeats.includes(seatId)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getSeatStyle(seatId, isExtraLegroom)}`}
                      >
                        {selectedSeats.includes(seatId) ? row : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
export { EXTRA_LEGROOM_ROWS };
