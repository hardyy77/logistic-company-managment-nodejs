--
-- PostgreSQL database dump
--

\restrict IXbdg4lKzp4pU5rcRioyw2EdHQVcxw2HhZ7QDueDKgfPVdhSA7do6g6mfmtZxa3

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(30),
    email character varying(255),
    license_number character varying(100) NOT NULL,
    license_category character varying(20) NOT NULL,
    medical_exam_valid_until date,
    status character varying(30) DEFAULT 'active'::character varying NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_id_seq OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: service_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_records (
    id integer NOT NULL,
    vehicle_id integer NOT NULL,
    service_type character varying(100) NOT NULL,
    description text,
    service_date date NOT NULL,
    cost numeric(10,2),
    next_service_due date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_records OWNER TO postgres;

--
-- Name: service_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_records_id_seq OWNER TO postgres;

--
-- Name: service_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_records_id_seq OWNED BY public.service_records.id;


--
-- Name: transport_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_orders (
    id integer NOT NULL,
    order_number character varying(50) NOT NULL,
    client_name character varying(255) NOT NULL,
    pickup_location character varying(255) NOT NULL,
    delivery_location character varying(255) NOT NULL,
    cargo_weight_kg numeric(10,2) NOT NULL,
    cargo_type character varying(100),
    planned_distance_km numeric(10,2),
    planned_duration_minutes integer,
    estimated_cost numeric(10,2),
    planned_date date NOT NULL,
    status character varying(30) DEFAULT 'new'::character varying NOT NULL,
    driver_id integer,
    vehicle_id integer,
    created_by_user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transport_orders OWNER TO postgres;

--
-- Name: transport_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transport_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_orders_id_seq OWNER TO postgres;

--
-- Name: transport_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transport_orders_id_seq OWNED BY public.transport_orders.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(255),
    password_hash character varying(255),
    role_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    registration_number character varying(20) NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    production_year integer,
    vehicle_type character varying(50) NOT NULL,
    capacity_kg numeric(10,2) NOT NULL,
    mileage integer DEFAULT 0,
    status character varying(30) DEFAULT 'available'::character varying NOT NULL,
    inspection_valid_until date,
    insurance_valid_until date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: service_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_records ALTER COLUMN id SET DEFAULT nextval('public.service_records_id_seq'::regclass);


--
-- Name: transport_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders ALTER COLUMN id SET DEFAULT nextval('public.transport_orders_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (id, first_name, last_name, phone, email, license_number, license_category, medical_exam_valid_until, status, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	dispatcher
3	driver
\.


--
-- Data for Name: service_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_records (id, vehicle_id, service_type, description, service_date, cost, next_service_due, created_at) FROM stdin;
\.


--
-- Data for Name: transport_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transport_orders (id, order_number, client_name, pickup_location, delivery_location, cargo_weight_kg, cargo_type, planned_distance_km, planned_duration_minutes, estimated_cost, planned_date, status, driver_id, vehicle_id, created_by_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password_hash, role_id, is_active, created_at) FROM stdin;
6	Arek	Lorenc	arek@example.com	$2b$10$EoIeVcr3k.0rhsMf/vGMsO6BV.maNUgnJEbSQmAB9yQRjb7bt654u	1	t	2026-04-25 08:10:06.171529
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, registration_number, brand, model, production_year, vehicle_type, capacity_kg, mileage, status, inspection_valid_until, insurance_valid_until, created_at) FROM stdin;
\.


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: service_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_records_id_seq', 1, false);


--
-- Name: transport_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transport_orders_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 1, false);


--
-- Name: drivers drivers_license_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_license_number_key UNIQUE (license_number);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_key UNIQUE (user_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: service_records service_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_records
    ADD CONSTRAINT service_records_pkey PRIMARY KEY (id);


--
-- Name: transport_orders transport_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_order_number_key UNIQUE (order_number);


--
-- Name: transport_orders transport_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_registration_number_key UNIQUE (registration_number);


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: service_records service_records_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_records
    ADD CONSTRAINT service_records_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: transport_orders transport_orders_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: transport_orders transport_orders_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: transport_orders transport_orders_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict IXbdg4lKzp4pU5rcRioyw2EdHQVcxw2HhZ7QDueDKgfPVdhSA7do6g6mfmtZxa3

