import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDB from '@/database';
import Availability from '@/models/availability';

export async function POST(req, { params }) {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectToDB();
    }

    const { user_id } = params; 
    const { availabilities } = await req.json(); 

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!availabilities || typeof availabilities !== 'object') {
      return NextResponse.json({ error: 'Invalid availability data' }, { status: 400 });
    }

    const isValidTimeSlot = (slots) => {
      return slots.every(({ startTime, endTime }) => 
        startTime && endTime && startTime < endTime
      );
    };

    const isValidAvailability = Object.values(availabilities).every(isValidTimeSlot);

    if (!isValidAvailability) {
      return NextResponse.json({ error: 'Invalid time slots (overlapping or incorrect format)' }, { status: 400 });
    }

    const updatedAvailability = await Availability.findOneAndUpdate(
      { user_id },
      { availabilities },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedAvailability, { status: 200 });
  } catch (error) {
    console.error('Error saving availability:', error);
    return NextResponse.json({ error: 'Failed to save availability' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectToDB();
    }

    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const availability = await Availability.findOne({ user_id });

    return NextResponse.json(availability || {}, { status: 200 });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
