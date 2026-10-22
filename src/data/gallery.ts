import type { ImageMetadata } from 'astro';
import wristMonitor from '../assets/gallery/wrist-monitor.jpg';
import wristMonitorTrial from '../assets/gallery/wrist-monitor-trial.jpg';
import operatingTheatre from '../assets/gallery/operating-theatre.jpg';
import esp32Board from '../assets/gallery/esp32-load-cell-board.jpg';
import fieldInstallReview from '../assets/gallery/field-install-review.jpg';
import fieldInstallHandover from '../assets/gallery/field-install-handover.jpg';
import fieldVisit from '../assets/gallery/field-visit.jpg';
import eduplusTeam from '../assets/gallery/eduplus-team.jpg';
import dispenserPoster from '../assets/gallery/dispenser-demo-poster.jpg';
import pidPoster from '../assets/gallery/pid-simulation-poster.jpg';

interface BaseItem {
  caption: string;
  alt: string;
}

export interface PhotoItem extends BaseItem {
  kind: 'photo';
  image: ImageMetadata;
}

export interface VideoItem extends BaseItem {
  kind: 'video';
  poster: ImageMetadata;
  /** Served from public/gallery/. */
  src: string;
  duration: string;
}

export type GalleryItem = PhotoItem | VideoItem;

export const gallery = {
  eyebrow: 'Hardware and fieldwork',
  heading: 'Gallery',
  intro: 'Devices I built and the places they went, from my engineering years in Indonesia, 2020–2021.',
} as const;

export const galleryItems: GalleryItem[] = [
  {
    kind: 'video',
    poster: dispenserPoster,
    src: '/gallery/dispenser-demo.mp4',
    duration: '2:33',
    caption: 'Hand-sanitiser dispenser with fill-level sensing — demo',
    alt: 'Video still: a man in a face mask using a wall-mounted sanitiser dispenser beside a small sensor unit',
  },
  {
    kind: 'photo',
    image: wristMonitor,
    caption: 'Wrist-worn temperature and SpO2 monitor on a custom PCB',
    alt: 'A blue custom circuit board worn on the wrist, its OLED screen reading temperature 29.89 °C and SpO2 100%',
  },
  {
    kind: 'photo',
    image: wristMonitorTrial,
    caption: 'Checking the wrist monitor against a hospital patient monitor',
    alt: 'A man wearing the wrist monitor and a fingertip sensor, with a clinical patient monitor beside him',
  },
  {
    kind: 'photo',
    image: operatingTheatre,
    caption: 'Hospital visit — anaesthesia workstation',
    alt: 'Two people in scrubs and hair covers examining an anaesthesia workstation in an operating theatre',
  },
  {
    kind: 'photo',
    image: esp32Board,
    caption: 'ESP32 control board with load-cell amplifier and power stage',
    alt: 'A green circuit board carrying an ESP32 module, a purple load-cell amplifier board, and a copper-wound transformer',
  },
  {
    kind: 'photo',
    image: fieldInstallReview,
    caption: 'Walking a client through an installed unit',
    alt: 'Three men looking into an open translucent enclosure on a rooftop terrace',
  },
  {
    kind: 'photo',
    image: fieldInstallHandover,
    caption: 'Handover after installation',
    alt: 'Four people standing either side of an illuminated translucent enclosure, two giving a thumbs up',
  },
  {
    kind: 'video',
    poster: pidPoster,
    src: '/gallery/pid-simulation.mp4',
    duration: '0:11',
    caption: 'PID control simulation of a mobile robot',
    alt: 'Video still: a simulated arena with a small robot, two red cylinders and two blue boxes',
  },
  {
    kind: 'photo',
    image: fieldVisit,
    caption: 'Field visit, Jombang, East Java',
    alt: 'Three men giving a thumbs up in a building lobby in front of a red and white banner',
  },
  {
    kind: 'photo',
    image: eduplusTeam,
    caption: 'The Eduplus Project team, 2021',
    alt: 'Group portrait of fourteen people in matching navy Eduplus Project t-shirts',
  },
];
