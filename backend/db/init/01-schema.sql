-- Create tables for the CCSP Dashboard application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    department VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active TIMESTAMP,
    login_count INTEGER DEFAULT 0
);

-- Forms table for all FEHD forms
CREATE TABLE IF NOT EXISTS forms (
    id SERIAL PRIMARY KEY,
    form_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(512),
    pdf_url VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    submission_count INTEGER DEFAULT 0,
    online_count INTEGER DEFAULT 0,
    paper_count INTEGER DEFAULT 0
);

-- Applications table for tracking application submissions
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL UNIQUE,
    form_id VARCHAR(20) NOT NULL REFERENCES forms(form_id),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_id VARCHAR(50) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(50),
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    submission_date TIMESTAMP NOT NULL DEFAULT NOW(),
    processing_date TIMESTAMP,
    completion_date TIMESTAMP,
    notes TEXT,
    processor_id INTEGER REFERENCES users(id)
);

-- Application timeline table for tracking status changes
CREATE TABLE IF NOT EXISTS application_timeline (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES applications(application_id),
    status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    changed_by INTEGER REFERENCES users(id),
    notes TEXT
);

-- Insert sample forms data for cemetery and crematorium services
INSERT INTO forms (form_id, name, category, url, pdf_url) VALUES 
('FEHB135', '申請安排私人火葬', '墳場及火葬場服務', 'https://app.fehd.gov.hk/ccsp/', '/english/forms/Fehb135.pdf'),
('FEHB136', '申請編配骨灰龕位（只適用於離島新骨灰龕位）', '墳場及火葬場服務', '', '/english/forms/Fehb136.pdf'),
('FEHB136A', '申請加放先人骨灰', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/feh136A.vxf&lang=zh_TW', '/english/forms/Fehb136a.pdf'),
('FEHB143', '申請火葬/土葬證明書', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb143.vxf&lang=zh_TW', '/english/forms/Fehb143.pdf'),
('FEHB144', '申請安葬於公眾墳場', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb144.vxf&lang=zh_TW', '/english/forms/Fehb144.pdf'),
('FEHB148', '申請遷移或撿拾骨殖許可證', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb148.vxf&lang=zh_TW', '/english/forms/fehb148.pdf'),
('FEHB151', '申請移除先人骨灰', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb151.vxf&lang=zh_TW', '/english/forms/Fehb151.pdf'),
('FEHB198', '申請在香港海域內將先人骨灰撒海', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb198.vxf&lang=zh_TW', '/english/forms/Fehb198.pdf'),
('FEHB219', '申請在紀念花園內撒骨灰 / 安裝紀念牌匾', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb219.vxf&lang=zh_TW', '/english/forms/Fehb219.pdf'),
('FEHB241', '申請撿拾非葬於墳場內的骨殖', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb241.vxf&lang=zh_TW', '/english/forms/fehb241.pdf'),
('FEHB251', '申請骨灰暫存服務', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb251.vxf&lang=zh_TW', '/english/forms/fehb251.pdf'),
('FEHB262', '申請安排金塔土葬或加葬骨殖／骨灰', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb262.vxf&lang=zh_TW', '/english/forms/fehb262.pdf'),
('FEHB263', '申請安排骨殖火化', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb263.vxf&lang=zh_TW', '/english/forms/fehb263.pdf'),
('FEHB264', '取消火葬場爐期申請書', '墳場及火葬場服務', 'https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb264.vxf&lang=zh_TW', '/english/forms/fehb264.pdf'),
('FEHB278', '綠色殯葬中央登記名冊申請', '墳場及火葬場服務', 'https://www.greenburial.gov.hk/gbcr/tc/register-online/index.html', '/english/forms/fehb278.pdf');

-- Insert sample users
INSERT INTO users (username, email, full_name, role, department, last_active, login_count) VALUES
('admin', 'admin@fehd.gov.hk', 'System Administrator', 'admin', 'IT Department', NOW(), 42),
('manager1', 'manager1@fehd.gov.hk', 'Cemetery Manager', 'manager', 'Cemetery Services', NOW() - INTERVAL '1 day', 35),
('officer1', 'officer1@fehd.gov.hk', 'Cemetery Officer 1', 'officer', 'Cemetery Services', NOW() - INTERVAL '2 days', 28),
('officer2', 'officer2@fehd.gov.hk', 'Cemetery Officer 2', 'officer', 'Cemetery Services', NOW() - INTERVAL '1 day', 22);

-- Insert sample application data with various statuses and types
DO $$
DECLARE
    form_ids TEXT[] := ARRAY['FEHB135', 'FEHB136', 'FEHB136A', 'FEHB143', 'FEHB144', 'FEHB148', 'FEHB151', 'FEHB198', 'FEHB219', 'FEHB241', 'FEHB251', 'FEHB262', 'FEHB263', 'FEHB264', 'FEHB278'];
    statuses TEXT[] := ARRAY['已批准', '處理中', '已提交', '已拒絕', '待處理'];
    types TEXT[] := ARRAY['私人火葬', '骨灰龕位', '加放骨灰', '火葬/土葬證明', '公眾墳場安葬'];
    app_id TEXT;
    form_id TEXT;
    status TEXT;
    app_type TEXT;
    i INTEGER;
    submission_date TIMESTAMP;
    processor_id INTEGER;
BEGIN
    FOR i IN 1..235 LOOP
        -- Generate unique application ID
        app_id := 'APP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(i::TEXT, 6, '0');
        
        -- Randomly select form, status and type
        form_id := form_ids[1 + floor(random() * array_length(form_ids, 1))];
        status := statuses[1 + floor(random() * array_length(statuses, 1))];
        app_type := types[1 + floor(random() * array_length(types, 1))];
        
        -- Set submission date within the last 90 days
        submission_date := NOW() - (random() * INTERVAL '90 days');
        
        -- Set processor ID if not submitted
        processor_id := NULL;
        IF status <> '已提交' AND status <> '待處理' THEN
            processor_id := 1 + floor(random() * 4);
        END IF;
        
        -- Insert the application
        INSERT INTO applications (
            application_id, 
            form_id, 
            applicant_name,
            applicant_id, 
            applicant_email, 
            applicant_phone, 
            type, 
            status, 
            submission_date, 
            processing_date, 
            completion_date, 
            processor_id
        ) VALUES (
            app_id,
            form_id,
            'Applicant ' || i,
            'ID' || LPAD(i::TEXT, 6, '0'),
            'applicant' || i || '@example.com',
            '9' || LPAD(floor(random() * 90000000 + 10000000)::TEXT, 8, '0'),
            app_type,
            status,
            submission_date,
            CASE WHEN status <> '已提交' AND status <> '待處理' THEN submission_date + (random() * INTERVAL '3 days') ELSE NULL END,
            CASE WHEN status = '已批准' OR status = '已拒絕' THEN submission_date + (random() * INTERVAL '7 days') ELSE NULL END,
            processor_id
        );
        
        -- Insert timeline record for submission
        INSERT INTO application_timeline (
            application_id,
            status,
            changed_at,
            changed_by,
            notes
        ) VALUES (
            app_id,
            '已提交',
            submission_date,
            NULL,
            '申請已提交'
        );
        
        -- Insert timeline record for processing if applicable
        IF status <> '已提交' AND status <> '待處理' THEN
            INSERT INTO application_timeline (
                application_id,
                status,
                changed_at,
                changed_by,
                notes
            ) VALUES (
                app_id,
                '處理中',
                submission_date + (random() * INTERVAL '3 days'),
                processor_id,
                '申請正在處理中'
            );
        END IF;
        
        -- Insert timeline record for completion if applicable
        IF status = '已批准' OR status = '已拒絕' THEN
            INSERT INTO application_timeline (
                application_id,
                status,
                changed_at,
                changed_by,
                notes
            ) VALUES (
                app_id,
                status,
                submission_date + (random() * INTERVAL '7 days'),
                processor_id,
                CASE WHEN status = '已批准' THEN '申請已批准' ELSE '申請已拒絕' END
            );
        END IF;
        
        -- Update form submission counts
        UPDATE forms 
        SET submission_count = submission_count + 1,
            online_count = CASE WHEN random() > 0.3 THEN online_count + 1 ELSE online_count END,
            paper_count = CASE WHEN random() <= 0.3 THEN paper_count + 1 ELSE paper_count END
        WHERE form_id = form_id;
    END LOOP;
END $$; 