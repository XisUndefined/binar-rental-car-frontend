/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiChevronDown,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

const DatePicker = () => {
  const getStartOfDay = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentDate, setCurrentDate] = useState(getStartOfDay())
  const [monthArray, setMonthArray] = useState([])

  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  const optionRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const generateMonthArray = () => {
      const weeks = []
      const thisMonth = new Date(currentDate)
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate()
      const firstDayOfWeek = currentDate.getDay()
      let week = new Array(7).fill(null)

      for (let i = 0; i < firstDayOfWeek; i++) {
        week[i] = null
      }

      let day = 1
      while (day <= lastDayOfMonth) {
        week[thisMonth.getDay()] = day
        if (thisMonth.getDay() === 6 || day === lastDayOfMonth) {
          weeks.push(week)
          week = new Array(7).fill(null)
        }
        day++
        thisMonth.setDate(thisMonth.getDate() + 1)
      }

      return weeks
    }

    setMonthArray(generateMonthArray())
  }, [currentDate])

  useEffect(() => {
    const addBackDrop = (e) => {
      if (
        showDatePicker &&
        !e.target.classList.contains('month-option') &&
        !containerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowDatePicker(false)
        setShowDropdown(false)
      }

      if (
        showDatePicker &&
        showDropdown &&
        !e.target.classList.contains('month-option') &&
        !optionRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }
    window.addEventListener('click', addBackDrop)

    return () => {
      window.removeEventListener('click', addBackDrop)
    }
  }, [showDatePicker, showDropdown])

  const incerementMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonthDate = new Date(prevDate)
      nextMonthDate.setMonth(prevDate.getMonth() + 1)
      return nextMonthDate
    })
  }

  const decrementMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonthDate = new Date(prevDate)
      nextMonthDate.setMonth(prevDate.getMonth() - 1)
      return nextMonthDate
    })
  }

  const MonthOptions = ({ currentDate }) => {
    const months = []

    for (let i = 0; i <= 12; i++) {
      months.push(
        `${new Date(new Date().getFullYear(), new Date().getMonth() + i).toLocaleString('default', { month: 'short' })} ${new Date(new Date().getFullYear(), new Date().getMonth() + i).getFullYear()}`
      )
    }

    return (
      <div
        ref={optionRef}
        className="dropdown-scrollbar absolute top-7 h-[275px] w-full overflow-y-auto rounded-sm border-[1px] border-[#b2b2b2] bg-white py-3 shadow-high"
      >
        {months.map((month) => (
          <button
            key={month}
            onClick={() => {
              setCurrentDate((prev) => {
                const monthDate = new Date(prev)
                const diffMonths =
                  (new Date(month).getFullYear() - monthDate.getFullYear()) *
                    12 +
                  (new Date(month).getMonth() - monthDate.getMonth())
                monthDate.setMonth(prev.getMonth() + diffMonths)
                return monthDate
              })
              setShowDropdown(!showDropdown)
            }}
            className={`month-option w-full px-3 py-[6px] text-start font-display text-base leading-6 ${`${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}` === month ? 'bg-[#e8f6f1]' : ''}`}
          >
            {month}
          </button>
        ))}
      </div>
    )
  }

  const MonthGrid = ({ monthArray }) => {
    const gridRowsClass =
      monthArray.length === 6 ? 'grid-rows-6 gap-x-1' : 'grid-rows-5'

    return (
      <div
        className={`grid ${gridRowsClass} h-[211px] w-[280px] select-none grid-cols-7`}
      >
        {monthArray.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <button
              className={`rounded-full text-sm font-light ${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(day)).toLocaleDateString() ? 'border-[1px] border-[#35b0a7]' : ''}`}
              key={`${weekIndex}-${dayIndex}`}
              value={day}
              disabled={!day}
            >
              {day}
            </button>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="MyDatePicker relative select-none">
      <div
        ref={buttonRef}
        className="flex h-9 w-full cursor-pointer items-center justify-between overflow-hidden rounded-sm border-[1px] border-neutral-300 fill-neutral-500 px-[9px] py-3"
        onClick={() => {
          setShowDatePicker(!showDatePicker)
        }}
      >
        <input
          type="text"
          placeholder="Pilih Tanggal"
          readOnly={true}
          className="h-9 w-full cursor-pointer border-none placeholder:text-[12px] placeholder:font-light placeholder:leading-[18px] placeholder:text-neutral-500 focus:outline-none"
        />
        <FiCalendar className="stroke-neutral-500" />
      </div>
      {showDatePicker ? (
        <div
          className="mdp-container absolute left-0 top-10 flex h-[392px] w-[312px] flex-wrap gap-4 overflow-hidden rounded-sm bg-white px-[15px] py-4 shadow-high"
          ref={containerRef}
        >
          <div className="navigation flex h-6 w-full justify-between">
            <button
              className="group w-7"
              onClick={decrementMonth}
              disabled={
                `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}` ===
                `${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`
              }
            >
              <FiArrowLeft className="h-full w-full group-disabled:stroke-neutral-300" />
            </button>
            <div
              ref={dropdownRef}
              className="relative flex w-36 cursor-pointer select-none items-center justify-center"
            >
              <span
                className="flex w-full items-center justify-center gap-2 text-sm font-normal"
                onClick={() => {
                  setShowDropdown(!showDropdown)
                }}
              >
                {`${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
                <FiChevronDown
                  id="dropdown-icon"
                  aria-expanded={showDropdown}
                  className="origin-center transform duration-200 ease-in-out aria-expanded:rotate-180"
                />
              </span>
              {showDropdown ? <MonthOptions currentDate={currentDate} /> : ''}
            </div>
            <button
              className="group w-7"
              onClick={incerementMonth}
              disabled={
                `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}` ===
                `${new Date(new Date().getFullYear() + 1, new Date().getMonth()).toLocaleString('default', { month: 'short' })} ${new Date(new Date().getFullYear() + 1, new Date().getMonth()).getFullYear()}`
              }
            >
              <FiArrowRight className="h-full w-full group-disabled:stroke-neutral-300" />
            </button>
          </div>
          <div className="flex w-full justify-center">
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              S
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              M
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              T
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              W
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              T
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              F
            </span>
            <span className="flex h-[38px] w-10 items-center justify-center text-sm font-normal">
              S
            </span>
          </div>
          <MonthGrid monthArray={monthArray} />
          <div className="flex gap-4">
            <p className="w-1/2 text-sm font-light leading-5">
              Choose range date max in 7 days
            </p>
            <button
              className="w-1/2 rounded-sm bg-darkblue-700 text-center text-sm font-bold leading-5 text-neutral-100 disabled:bg-darkblue-100"
              disabled
            >
              Pilih Tanggal
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default DatePicker
