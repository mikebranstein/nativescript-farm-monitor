export class MomentaryWeather {
    constructor(
        public DeviceId: string, 
        public PublishDate: Date,
        public Humidity: number,
        public Temperature: number,
        public Pressure: number,
        public SoilMoisture: number,
        public SoilTemperature: number,
        public WindSpeedMPH: number,
        public WindDirection: number,
        public RainInInches: number,
        public DeviceVoltage: number,
        public DeviceStateOfCharge: number
    ) {}
}