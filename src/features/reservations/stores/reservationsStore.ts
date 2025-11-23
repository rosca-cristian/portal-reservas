import { create } from 'zustand';
import type { BookingStepOne, BookingStepTwo } from '../schemas/booking.schema';
import type { Reservation, PrivacyOption } from '../../../types/reservation';

interface WizardState {
  currentStep: 1 | 2;
  stepOne: Partial<BookingStepOne>;
  stepTwo: Partial<BookingStepTwo>;
  // Group room specific fields
  groupSize?: number;
  privacyOption?: PrivacyOption;
  isGroupRoom?: boolean;
}

interface ReservationsStore {
  // Reservations
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;

  // Wizard state
  wizard: WizardState;

  // Actions
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Wizard actions
  setWizardStep: (step: 1 | 2) => void;
  setStepOneData: (data: Partial<BookingStepOne>) => void;
  setStepTwoData: (data: Partial<BookingStepTwo>) => void;
  setGroupSize: (size: number) => void;
  setPrivacyOption: (option: PrivacyOption) => void;
  setIsGroupRoom: (isGroupRoom: boolean) => void;
  resetWizard: () => void;
}

const initialWizardState: WizardState = {
  currentStep: 1,
  stepOne: {},
  stepTwo: {},
};

export const useReservationsStore = create<ReservationsStore>((set) => ({
  // Initial state
  reservations: [],
  isLoading: false,
  error: null,
  wizard: initialWizardState,

  // Actions
  setReservations: (reservations) => set({ reservations }),
  addReservation: (reservation) =>
    set((state) => ({
      reservations: [...state.reservations, reservation],
    })),
  removeReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Wizard actions
  setWizardStep: (step) =>
    set((state) => ({
      wizard: { ...state.wizard, currentStep: step },
    })),
  setStepOneData: (data) =>
    set((state) => ({
      wizard: {
        ...state.wizard,
        stepOne: { ...state.wizard.stepOne, ...data },
      },
    })),
  setStepTwoData: (data) =>
    set((state) => ({
      wizard: {
        ...state.wizard,
        stepTwo: { ...state.wizard.stepTwo, ...data },
      },
    })),
  setGroupSize: (size) =>
    set((state) => ({
      wizard: { ...state.wizard, groupSize: size },
    })),
  setPrivacyOption: (option) =>
    set((state) => ({
      wizard: { ...state.wizard, privacyOption: option },
    })),
  setIsGroupRoom: (isGroupRoom) =>
    set((state) => ({
      wizard: { ...state.wizard, isGroupRoom },
    })),
  resetWizard: () =>
    set({ wizard: initialWizardState }),
}));
