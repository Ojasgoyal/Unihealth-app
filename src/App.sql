
-- First, we'll create the appointments and prescriptions tables (don't run this file, we'll create SQL migrations later)

-- CREATE TABLE IF NOT EXISTS public.appointments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   patient_id UUID REFERENCES auth.users(id) NOT NULL,
--   doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
--   appointment_date DATE NOT NULL,
--   start_time TIME NOT NULL,
--   end_time TIME NOT NULL,
--   reason TEXT,
--   notes TEXT,
--   status TEXT NOT NULL DEFAULT 'pending',
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- CREATE TABLE IF NOT EXISTS public.prescriptions (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   appointment_id UUID REFERENCES public.appointments(id) NOT NULL,
--   doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
--   patient_id UUID REFERENCES auth.users(id) NOT NULL,
--   medications TEXT[] NOT NULL DEFAULT '{}',
--   dosage TEXT NOT NULL,
--   instructions TEXT NOT NULL,
--   issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
--   expiry_date DATE,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );
