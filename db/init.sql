-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS ShiftReport, SupEmployee, Wo, Department, WorkCenter CASCADE;

CREATE TABLE Department (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL
);

CREATE TABLE WorkCenter (
    WC_ID SERIAL PRIMARY KEY,
    WC_Description VARCHAR(255),
    WC_name VARCHAR(255) NOT NULL
);

CREATE TABLE SupEmployee (
    EmpId SERIAL PRIMARY KEY,
    Department INT REFERENCES Department(dept_id),
    WorkCenter INT REFERENCES WorkCenter(WC_ID),
    Shift VARCHAR(50)
);

CREATE TABLE Wo (
    Wo_ID SERIAL PRIMARY KEY,
    Work_Order VARCHAR(255) NOT NULL,
    Description TEXT,
    Qty INT NOT NULL CHECK (Qty > 0)
);

CREATE TABLE ShiftReport (
    SRID SERIAL PRIMARY KEY,
    Wo_ID INT REFERENCES Wo(Wo_ID),
    Emp_Id INT REFERENCES SupEmployee(EmpId),
    date_time TIMESTAMP NOT NULL,
    WorkCenter INT REFERENCES WorkCenter(WC_ID),
    shift VARCHAR(50),
    Team_Count INT CHECK (Team_Count >= 0),
    Hours INT CHECK (Hours >= 0),
    Min INT CHECK (Min >= 0)
);