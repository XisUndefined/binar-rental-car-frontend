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
  const [currentDate, setCurrentDate] = useState(getStartOfDay())
  const [monthDetails, setMonthDetails] = useState([])

  const containerRef = useRef(null)
  const buttonRef = useRef(null)

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

    setMonthDetails(generateMonthArray())
  }, [currentDate])

  useEffect(() => {
    const addBackDrop = (e) => {
      if (
        showDatePicker &&
        !containerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowDatePicker(false)
      }
    }
    window.addEventListener('click', addBackDrop)

    return () => {
      window.removeEventListener('click', addBackDrop)
    }
  }, [showDatePicker])

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

  const MonthGrid = ({ monthArray }) => {
    const gridRowsClass =
      monthArray.length === 6 ? 'grid-rows-6' : 'grid-rows-5'

    return (
      <div className={`grid ${gridRowsClass} h-[211px] w-[280px] grid-cols-7`}>
        {monthArray.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <button
              className="rounded-full text-sm font-light active:border-[1px] active:border-[#35b0a7]"
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
    <div className="MyDatePicker relative">
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
          className="mdp-container top-[40px]h-[392px] absolute left-0 flex w-[312px] flex-wrap gap-4 overflow-hidden rounded-sm bg-white px-[15px] py-4 shadow-high"
          ref={containerRef}
        >
          <div className="navigation flex h-6 w-full justify-between">
            <button className="w-7" onClick={decrementMonth}>
              <FiArrowLeft className="h-full w-full" />
            </button>
            <span className="flex cursor-pointer select-none items-center gap-2 text-sm font-normal">
              {`${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
              <FiChevronDown />
            </span>
            <button className="w-7" onClick={incerementMonth}>
              <FiArrowRight className="h-full w-full" />
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
          <MonthGrid monthArray={monthDetails} />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default DatePicker
