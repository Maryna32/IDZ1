-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Бер 03 2025 р., 17:11
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `lb_pdo_workers`
--

-- --------------------------------------------------------

--
-- Структура таблиці `department`
--

CREATE TABLE `department` (
  `ID_DEPARTMENT` int(11) NOT NULL,
  `chief` char(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251 COLLATE=cp1251_general_ci;

--
-- Дамп даних таблиці `department`
--

INSERT INTO `department` (`ID_DEPARTMENT`, `chief`) VALUES
(0, 'Jobs'),
(1, 'Wozniak'),
(2, 'Gates'),
(3, 'Smith'),
(4, 'Johnson');

-- --------------------------------------------------------

--
-- Структура таблиці `project`
--

CREATE TABLE `project` (
  `ID_PROJECTS` int(11) NOT NULL,
  `name_project` char(60) DEFAULT NULL,
  `manager` char(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251 COLLATE=cp1251_general_ci;

--
-- Дамп даних таблиці `project`
--

INSERT INTO `project` (`ID_PROJECTS`, `name_project`, `manager`) VALUES
(0, 'Project_1, Hospital', 'Ivanov'),
(1, 'Project_2, Bank', 'Petrov'),
(2, 'Project_3, Police', 'Sidorov'),
(3, 'Project_4, School', 'Dmitriev'),
(4, 'Project_5, Airport', 'Kovalev');

-- --------------------------------------------------------

--
-- Структура таблиці `worker`
--

CREATE TABLE `worker` (
  `ID_WORKER` int(11) NOT NULL,
  `FID_DEPARTMENT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251 COLLATE=cp1251_general_ci;

--
-- Дамп даних таблиці `worker`
--

INSERT INTO `worker` (`ID_WORKER`, `FID_DEPARTMENT`) VALUES
(2, 0),
(6, 0),
(5, 1),
(1, 2),
(3, 2),
(4, 2),
(7, 2);

-- --------------------------------------------------------

--
-- Структура таблиці `work_table`
--

CREATE TABLE `work_table` (
  `FID_WORKER` int(11) DEFAULT NULL,
  `FID_PROJECTS` int(11) DEFAULT NULL,
  `date_project` date NOT NULL,
  `time_start` date DEFAULT NULL,
  `time_end` date DEFAULT NULL,
  `description` char(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=cp1251 COLLATE=cp1251_general_ci;

--
-- Дамп даних таблиці `work_table`
--

INSERT INTO `work_table` (`FID_WORKER`, `FID_PROJECTS`, `date_project`, `time_start`, `time_end`, `description`) VALUES
(1, 2, '2019-04-10', '2019-04-10', '2019-04-14', 'some work for 16-5'),
(3, 1, '2019-04-15', '2019-04-15', '2019-04-17', 'bank'),
(4, 1, '2019-04-16', '2019-04-15', '2019-04-17', 'new bank'),
(2, 0, '2019-04-22', '2019-04-22', '2019-04-30', 'hospital'),
(5, 3, '2025-03-01', '2025-03-01', '2025-03-10', 'school project tasks'),
(6, 4, '2025-03-05', '2025-03-05', '2025-03-12', 'airport project management'),
(7, 2, '2025-03-10', '2025-03-10', '2025-03-15', 'bank system update');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`ID_DEPARTMENT`);

--
-- Індекси таблиці `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`ID_PROJECTS`);

--
-- Індекси таблиці `worker`
--
ALTER TABLE `worker`
  ADD PRIMARY KEY (`ID_WORKER`),
  ADD KEY `FID_DEPARTMENT` (`FID_DEPARTMENT`);

--
-- Індекси таблиці `work_table`
--
ALTER TABLE `work_table`
  ADD PRIMARY KEY (`date_project`),
  ADD KEY `FID_WORKER` (`FID_WORKER`),
  ADD KEY `FID_PROJECTS` (`FID_PROJECTS`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `worker`
--
ALTER TABLE `worker`
  MODIFY `ID_WORKER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`FID_DEPARTMENT`) REFERENCES `department` (`ID_DEPARTMENT`);

--
-- Обмеження зовнішнього ключа таблиці `work_table`
--
ALTER TABLE `work_table`
  ADD CONSTRAINT `work_ibfk_1` FOREIGN KEY (`FID_WORKER`) REFERENCES `worker` (`ID_WORKER`),
  ADD CONSTRAINT `work_ibfk_2` FOREIGN KEY (`FID_PROJECTS`) REFERENCES `project` (`ID_PROJECTS`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
