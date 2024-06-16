import org.devicefarm.FlutterBy;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class FlutterByTests {
    @Test
    public void byKey() {
        Assertions.assertEquals(FlutterBy.key("demo").toString(), "FlutterBy.key: demo");
    }
}
