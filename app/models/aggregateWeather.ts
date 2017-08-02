export class AggregateWeather {
    constructor(
        public DeviceId: string, 
        public PublishDate: Date,
        public AverageHumidity: number,
        public AverageTemperature: number,
        public AveragePressure: number,
        public AverageSoilMoisture: number,
        public AverageSoilTemperature: number,
        public AverageWindSpeedMPH: number,
        public AverageWindDirection: number,
        public RainInInches: number,
        public AverageDeviceVoltage: number,
        public AverageDeviceStateOfCharge: number,
        public MinDeviceStateOfCharge: number,
        public MaxDeviceStateOfCharge: number
    ) {}
}
