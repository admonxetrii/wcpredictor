import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LOCK_BEFORE_KICKOFF_MS } from "./constants";

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a match's prediction window is locked.
 * Predictions lock 1 hour before kickoff.
 */
export function isMatchLocked(kickoffTime: Date): boolean {
  const now = new Date();
  const lockTime = new Date(kickoffTime.getTime() - LOCK_BEFORE_KICKOFF_MS);
  return now >= lockTime;
}

/**
 * Get the time remaining until a match locks.
 * Returns null if already locked.
 */
export function getTimeUntilLock(kickoffTime: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  const now = new Date();
  const lockTime = new Date(kickoffTime.getTime() - LOCK_BEFORE_KICKOFF_MS);
  const diff = lockTime.getTime() - now.getTime();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Format a date for display.
 * Shows both Nepal Time (NPT, UTC+5:45) and US Eastern Time.
 */
export function formatMatchDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/**
 * Format a short date (Jun 11).
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format time only (6:00 PM).
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Get the countdown to a target date.
 */
export function getCountdown(target: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}
