package at.htl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.context.ManagedExecutor;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logmanager.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Listener for Message Queue.
 * In order no to block the incoming MQTT we place received incoming values into a queue.
 * In a second thread all values present are pulled from the queue and inserted into the database asynchronously.
 */

@ApplicationScoped
public class SimpleMqttReceiver {
    private Logger logger = Logger.getLogger(SimpleMqttReceiver.class.getName());

    private ConcurrentLinkedQueue<MeasurementValue> queue = new ConcurrentLinkedQueue();
    @Inject
    ManagedExecutor executor;

    /**
     * maximum queue size
     * If we are not fast enough with inserting we skip values.
     */
    @ConfigProperty(name = "inserter.max.cache")
    int inserterMaxCache;
    public static record MeasurementValue(
            long timestamp,
            double value
    ) {}

    @Incoming("measurements")
    public void receiveMeasurement(byte[] byteArray) {
        var messageString = new String(byteArray);
        //logger.info("Received raw message: " + messageString);

        try {
            var mapper = new ObjectMapper();
            var jsonNode = mapper.readTree(messageString);

            var timestamp = jsonNode.get("timestamp").asLong();
            var value = jsonNode.get("value").asDouble();

            var measurementValue = new MeasurementValue(timestamp, value);

            if (queue.size() <= inserterMaxCache) {
                queue.add(measurementValue);
            }

            //insertMeasurement(timestamp, value);
            CompletableFuture.supplyAsync(this::insertNextValue, executor);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Transactional
    public int insertNextValue() {
        int count = 0;
        while (!queue.isEmpty()) {
            var value = queue.remove();
            insertMeasurement(value.timestamp, value.value);
            count++;
        }
        return count;
    }

    private void insertMeasurement(long timestamp, double value) {
        Measurement measurement = new Measurement();
        measurement.timestamp = timestamp;
        measurement.value = value;
        measurement.persist();
        logger.info("Insert successful");
    }

}
