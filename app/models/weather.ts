export class Weather {

    constructor(
        public DeviceId: string, 
        public PublishDate: Date,
        public Humidity: number,
        public Temperature: number,
        public Pressure: number,
        public DeviceVoltage: number,
        public DeviceStateOfCharge: number
    ) {}
}